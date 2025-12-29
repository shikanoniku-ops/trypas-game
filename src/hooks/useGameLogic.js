import { useState, useEffect, useCallback } from 'react';
import { PIECE_TYPES, PIECE_SCORES } from '../constants/colors';
import { BOARD_LINES, BOARD_SIZE } from '../constants/rules';

const INITIAL_PIECES_COUNT = 3;

export const useGameLogic = (gameMode = 'LOCAL') => {
    // 'LOCAL' | 'SOLO' | 'CPU_EASY' | 'CPU_NORMAL' | 'CPU_HARD'
    const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null));
    const [turn, setTurn] = useState(1); // 1 or 2 (2 is CPU in CPU modes)
    const [scores, setScores] = useState({ p1: 0, p2: 0 });
    const [phase, setPhase] = useState('REMOVING');
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [winner, setWinner] = useState(null);
    const [lastActionMessage, setLastActionMessage] = useState('');
    const [initialBoard, setInitialBoard] = useState(null); // Store initial board for restart

    // Timer states
    const [elapsedTime, setElapsedTime] = useState(0); // 経過時間（SOLO用）
    const [turnStartTime, setTurnStartTime] = useState(Date.now()); // ターン開始時刻
    const [turnTime, setTurnTime] = useState(0); // 現在のターンの思考時間
    const [totalThinkingTime, setTotalThinkingTime] = useState({ p1: 0, p2: 0 }); // 累積思考時間

    // Captured pieces states
    const [capturedPieces, setCapturedPieces] = useState({ p1: [], p2: [] }); // 取ったコマ

    // Replay states
    const [moveHistory, setMoveHistory] = useState([]); // 手順履歴
    const [isReplaying, setIsReplaying] = useState(false); // リプレイ中かどうか
    const [replayStep, setReplayStep] = useState(0); // リプレイの現在のステップ

    const isCPUMode = gameMode.startsWith('CPU_');
    const isSoloMode = gameMode === 'SOLO';

    // Initialize board
    const initializeBoard = useCallback((preservedBoard = null) => {
        let pieces;

        if (preservedBoard) {
            pieces = [...preservedBoard];
        } else {
            pieces = [];
            PIECE_TYPES.forEach(color => {
                for (let i = 0; i < INITIAL_PIECES_COUNT; i++) {
                    pieces.push(color);
                }
            });

            // Shuffle
            for (let i = pieces.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
            }
            setInitialBoard([...pieces]);
        }

        setBoard(pieces);
        setTurn(1);
        setScores({ p1: 0, p2: 0 });
        setPhase('REMOVING');
        setSelectedSpot(null);
        setValidMoves([]);
        setWinner(null);
        setLastActionMessage('');
        setElapsedTime(0);
        setTurnStartTime(Date.now());
        setTurnTime(0);
        setTotalThinkingTime({ p1: 0, p2: 0 });
        setCapturedPieces({ p1: [], p2: [] });
        setMoveHistory([]);
        setIsReplaying(false);
        setReplayStep(0);
    }, []);

    useEffect(() => {
        initializeBoard();
    }, [initializeBoard]);

    // Timer effect
    useEffect(() => {
        if (phase === 'GAME_OVER' || isReplaying) return;

        const interval = setInterval(() => {
            if (phase === 'PLAYING') {
                // 全モードで経過時間を計測
                setElapsedTime(prev => prev + 1);

                if (!isSoloMode) {
                    // 対戦モードではさらにターン思考時間を計測
                    setTurnTime(Math.floor((Date.now() - turnStartTime) / 1000));
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, isSoloMode, turnStartTime, isReplaying]);

    // Helper to find lines containing a spot
    const getLinesForSpot = (spotIndex) => {
        return BOARD_LINES.filter(line => line.includes(spotIndex));
    };

    // Calculate valid moves with multi-jump logic
    const getValidMoves = useCallback((spotIndex, currentBoard) => {
        if (currentBoard[spotIndex] === null) return [];

        const moves = [];
        const lines = getLinesForSpot(spotIndex);

        lines.forEach(line => {
            const idxInLine = line.indexOf(spotIndex);

            // Check both directions
            [-1, 1].forEach(direction => {
                let jumpedPieces = [];
                let currentIdx = idxInLine + direction;

                // Collect continuous pieces
                while (
                    currentIdx >= 0 &&
                    currentIdx < line.length &&
                    currentBoard[line[currentIdx]] !== null
                ) {
                    jumpedPieces.push(line[currentIdx]);
                    currentIdx += direction;
                }

                // Check landing spot
                if (
                    jumpedPieces.length > 0 && // Must jump at least one
                    jumpedPieces.length <= 3 && // Max 3 pieces
                    currentIdx >= 0 &&
                    currentIdx < line.length &&
                    currentBoard[line[currentIdx]] === null // Landing spot must be empty
                ) {
                    moves.push({
                        start: spotIndex,
                        end: line[currentIdx],
                        captured: jumpedPieces // Array of indices (but only last one will be taken)
                    });
                }
            });
        });

        return moves;
    }, []);

    // Check if any move is possible
    const checkAnyMovePossible = useCallback((currentBoard) => {
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (currentBoard[i] !== null) {
                const moves = getValidMoves(i, currentBoard);
                if (moves.length > 0) return true;
            }
        }
        return false;
    }, [getValidMoves]);

    // CPU Logic
    useEffect(() => {
        if (isCPUMode && turn === 2 && phase === 'PLAYING' && !winner) {
            const timer = setTimeout(() => {
                const possibleMoves = [];
                for (let i = 0; i < BOARD_SIZE; i++) {
                    if (board[i] !== null) {
                        const moves = getValidMoves(i, board);
                        moves.forEach(m => possibleMoves.push(m));
                    }
                }

                if (possibleMoves.length > 0) {
                    let selectedMove;

                    if (gameMode === 'CPU_EASY') {
                        // Random move
                        selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    } else if (gameMode === 'CPU_NORMAL') {
                        // Prioritize high score
                        possibleMoves.sort((a, b) => {
                            const capturedA = a.captured[a.captured.length - 1];
                            const capturedB = b.captured[b.captured.length - 1];
                            const scoreA = PIECE_SCORES[board[capturedA]];
                            const scoreB = PIECE_SCORES[board[capturedB]];
                            return scoreB - scoreA;
                        });
                        selectedMove = possibleMoves[0];
                    } else { // CPU_HARD
                        // Prioritize red pieces, then high score
                        possibleMoves.sort((a, b) => {
                            const capturedA = a.captured[a.captured.length - 1];
                            const capturedB = b.captured[b.captured.length - 1];
                            const hasRedA = board[capturedA] === 'RED';
                            const hasRedB = board[capturedB] === 'RED';

                            if (hasRedA && !hasRedB) return -1;
                            if (!hasRedA && hasRedB) return 1;

                            const scoreA = PIECE_SCORES[board[capturedA]];
                            const scoreB = PIECE_SCORES[board[capturedB]];
                            return scoreB - scoreA;
                        });
                        selectedMove = possibleMoves[0];
                    }

                    executeMove(selectedMove);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isCPUMode, turn, phase, board, winner, getValidMoves, gameMode]);

    const executeMove = (move) => {
        const newBoard = [...board];
        const piece = newBoard[move.start];

        // Move piece
        newBoard[move.start] = null;
        newBoard[move.end] = piece;

        // CORRECTED RULE: Only capture the LAST piece (closest to landing spot)
        const capturedIndex = move.captured[move.captured.length - 1];
        const capturedColor = newBoard[capturedIndex];
        const moveScore = PIECE_SCORES[capturedColor];
        const hasRed = capturedColor === 'RED';

        newBoard[capturedIndex] = null;

        setBoard(newBoard);

        // Record move history for replay
        const historyEntry = {
            boardBefore: [...board],
            boardAfter: [...newBoard],
            move: move,
            player: turn,
            capturedColor: capturedColor,
            score: moveScore,
            timestamp: Date.now(),
            thinkingTime: turnTime
        };
        setMoveHistory(prev => [...prev, historyEntry]);

        // Update score
        const currentPlayer = turn === 1 ? 'p1' : 'p2';
        setScores(prev => ({
            ...prev,
            [currentPlayer]: prev[currentPlayer] + moveScore
        }));

        // Record captured piece
        setCapturedPieces(prev => ({
            ...prev,
            [currentPlayer]: [...prev[currentPlayer], capturedColor]
        }));

        // Update total thinking time
        if (!isSoloMode) {
            setTotalThinkingTime(prev => ({
                ...prev,
                [currentPlayer]: prev[currentPlayer] + turnTime
            }));
        }

        // Check Red Bonus
        if (hasRed) {
            setLastActionMessage(`${isCPUMode && turn === 2 ? 'CPU' : `Player ${turn}`} gets EXTRA TURN! (Red Piece)`);
            // Turn does not change, but reset turn timer
            setTurnStartTime(Date.now());
            setTurnTime(0);
        } else {
            setLastActionMessage('');
            if (!isSoloMode) {
                setTurn(prev => prev === 1 ? 2 : 1);
                setTurnStartTime(Date.now());
                setTurnTime(0);
            }
        }

        setSelectedSpot(null);
        setValidMoves([]);

        // Check Game Over
        if (!checkAnyMovePossible(newBoard)) {
            setPhase('GAME_OVER');

            const finalP1 = currentPlayer === 'p1' ? scores.p1 + moveScore : scores.p1;
            const finalP2 = currentPlayer === 'p2' ? scores.p2 + moveScore : scores.p2;

            if (isSoloMode) {
                // SOLO MODE RULE: Ending with red piece = 0 points
                if (hasRed) {
                    setScores({ p1: 0, p2: 0 });
                    setLastActionMessage('最後に赤コマを取ったため、スコアは0点です');
                }
                setWinner('SOLO'); // Special case for solo mode
            } else {
                // 手詰まりになった方が負け（最後に手を打ったプレイヤーの相手が負け）
                // つまり、現在のプレイヤーが勝ち
                // ただし、最後に赤を取った場合は負け
                let winnerPlayer;
                if (hasRed) {
                    // 最後に赤を取った場合は負け
                    winnerPlayer = turn === 1 ? 2 : 1;
                } else {
                    // 通常は手詰まりになった方（次のターンのプレイヤー）が負け
                    winnerPlayer = turn;
                }

                setWinner(winnerPlayer);

                // 敗者のスコアを0点にする
                const loserPlayer = winnerPlayer === 1 ? 'p2' : 'p1';
                setScores(prev => ({
                    ...prev,
                    [loserPlayer]: 0
                }));
            }
        }
    };

    const handleSpotClick = (index) => {
        if (phase === 'GAME_OVER') return;
        if (isCPUMode && turn === 2) return; // Block input during CPU turn

        if (phase === 'REMOVING') {
            if (board[index] !== null) {
                const removedColor = board[index];

                // SOLO MODE RULE: Cannot remove red piece at the start
                if (isSoloMode && removedColor === 'RED') {
                    setLastActionMessage('赤コマは最初に取ることはできません');
                    setTimeout(() => setLastActionMessage(''), 2000);
                    return;
                }

                const newBoard = [...board];
                const removedScore = PIECE_SCORES[removedColor];
                newBoard[index] = null;
                setBoard(newBoard);

                // Record initial remove for replay
                const historyEntry = {
                    boardBefore: [...board],
                    boardAfter: [...newBoard],
                    move: { type: 'REMOVE', index: index },
                    player: 1,
                    capturedColor: removedColor,
                    score: removedScore,
                    timestamp: Date.now(),
                    thinkingTime: 0
                };
                setMoveHistory([historyEntry]);

                // 初手の得点を加算（Player 1が初手を取る）
                setScores(prev => ({
                    ...prev,
                    p1: prev.p1 + removedScore
                }));

                // 初手で取ったコマを記録
                setCapturedPieces(prev => ({
                    ...prev,
                    p1: [removedColor]
                }));

                setPhase('PLAYING');

                // 初手で赤を取っても飛び越えていないため連続手番にならない
                if (isCPUMode) {
                    setTurn(2); // CPU goes first in CPU mode
                } else if (isSoloMode) {
                    setTurn(1); // Solo stays on P1
                } else {
                    setTurn(2); // P2 goes first in local mode
                }

                // Reset turn timer
                setTurnStartTime(Date.now());
                setTurnTime(0);
            }
            return;
        }

        if (phase === 'PLAYING') {
            if (selectedSpot === index) {
                setSelectedSpot(null);
                setValidMoves([]);
                return;
            }

            const move = validMoves.find(m => m.end === index);
            if (move) {
                executeMove(move);
                return;
            }

            if (board[index] !== null) {
                const moves = getValidMoves(index, board);
                if (moves.length > 0) {
                    setSelectedSpot(index);
                    setValidMoves(moves);
                } else {
                    setSelectedSpot(null);
                    setValidMoves([]);
                }
            }
        }
    };

    const resetGame = (useSameBoard = false) => {
        if (useSameBoard && initialBoard) {
            initializeBoard(initialBoard);
        } else {
            initializeBoard();
        }
    };

    // Replay functions
    const startReplay = () => {
        if (moveHistory.length === 0) return;
        setIsReplaying(true);
        setReplayStep(0);
        // Reset board to initial state (before first move)
        if (moveHistory[0]) {
            setBoard(moveHistory[0].boardBefore);
        }
    };

    const stopReplay = () => {
        setIsReplaying(false);
        // Restore current game state
        if (moveHistory.length > 0) {
            setBoard(moveHistory[moveHistory.length - 1].boardAfter);
        }
    };

    const nextReplayStep = () => {
        if (replayStep < moveHistory.length - 1) {
            const nextStep = replayStep + 1;
            setReplayStep(nextStep);
            setBoard(moveHistory[nextStep].boardAfter);
        }
    };

    const prevReplayStep = () => {
        if (replayStep > 0) {
            const prevStep = replayStep - 1;
            setReplayStep(prevStep);
            setBoard(moveHistory[prevStep].boardAfter);
        } else if (replayStep === 0 && moveHistory[0]) {
            setBoard(moveHistory[0].boardBefore);
        }
    };

    const jumpToReplayStep = (step) => {
        if (step >= 0 && step < moveHistory.length) {
            setReplayStep(step);
            setBoard(moveHistory[step].boardAfter);
        }
    };

    // Generate contextual hint based on game state
    const getGameHint = useCallback(() => {
        if (phase !== 'GAME_OVER') return null;

        const currentPlayer = isSoloMode ? 'p1' : (turn === 1 ? 'p1' : 'p2');
        const playerCaptured = capturedPieces[currentPlayer];
        const finalScore = scores[currentPlayer];

        // Check if ended with red piece (score = 0)
        if (finalScore === 0 && playerCaptured.length > 0) {
            const lastCaptured = playerCaptured[playerCaptured.length - 1];
            if (lastCaptured === 'RED') {
                return '最後に赤コマをとると0点になります';
            }
        }

        return null;
    }, [phase, isSoloMode, turn, capturedPieces, scores]);

    return {
        board,
        turn,
        scores,
        phase,
        selectedSpot,
        validMoves,
        winner,
        lastActionMessage,
        gameMode,
        handleSpotClick,
        resetGame,
        // Timer info
        elapsedTime,
        turnTime,
        totalThinkingTime,
        // Captured pieces
        capturedPieces,
        // Replay info
        moveHistory,
        isReplaying,
        replayStep,
        startReplay,
        stopReplay,
        nextReplayStep,
        prevReplayStep,
        jumpToReplayStep,
        // Hint generation
        getGameHint
    };
};

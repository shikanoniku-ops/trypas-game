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
    const [replayScores, setReplayScores] = useState({ p1: 0, p2: 0 }); // リプレイ時のスコア
    const [replayTurn, setReplayTurn] = useState(1); // リプレイ時のターン

    // TRYPAS notification state
    const [showTrypas, setShowTrypas] = useState(false); // 赤コマを取った時の通知

    // Game over delay and reason states
    const [isGameOverPending, setIsGameOverPending] = useState(false); // 遅延表示中
    const [gameOverReason, setGameOverReason] = useState(''); // 勝敗理由
    const [lastMoveHighlight, setLastMoveHighlight] = useState(null); // 最後の手のハイライト

    const isCPUMode = gameMode.startsWith('CPU_');
    const isSoloMode = gameMode === 'SOLO';

    const getPlayerLabel = useCallback((playerNum) => {
        if (isCPUMode) {
            return playerNum === 1 ? 'YOU' : 'CPU';
        }
        return playerNum === 1 ? 'P1' : 'P2';
    }, [isCPUMode]);

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
        setIsGameOverPending(false);
        setGameOverReason('');
        setLastMoveHighlight(null);
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
        const currentPlayer = turn === 1 ? 'p1' : 'p2';
        const newScores = {
            ...scores,
            [currentPlayer]: scores[currentPlayer] + moveScore
        };
        const historyEntry = {
            boardBefore: [...board],
            boardAfter: [...newBoard],
            move: move,
            player: turn,
            capturedColor: capturedColor,
            score: moveScore,
            totalScores: newScores, // 累積スコアを記録
            timestamp: Date.now(),
            thinkingTime: turnTime
        };
        setMoveHistory(prev => [...prev, historyEntry]);

        // Update score
        setScores(newScores);

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

        setSelectedSpot(null);
        setValidMoves([]);

        // Check Game Over FIRST (before TRYPAS notification)
        const isGameOver = !checkAnyMovePossible(newBoard);

        // 重要: ターン変更前に「最後の一手を打ったプレイヤー」を保存
        const playerWhoMadeLastMove = turn;

        // 赤コマボーナスの処理（ゲーム終了でなく、ソロモードでない場合のみTRYPAS通知を表示）
        if (hasRed) {
            if (!isGameOver && !isSoloMode) {
                const playerName = getPlayerLabel(turn);
                setLastActionMessage(`${playerName} - 追加ターン獲得！`);
                // ゲーム継続中かつソロモードでない場合のみTRYPAS通知を表示
                setShowTrypas(true);
                setTimeout(() => setShowTrypas(false), 750);
            }
            // ターンは変わらないが、ターンタイマーはリセット
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

        // Handle Game Over
        if (isGameOver) {
            // 最後の手をハイライト
            setLastMoveHighlight(move.end);

            // 遅延表示開始
            setIsGameOverPending(true);

            // 現在の手番で得たスコアを含めた最終スコアを計算
            const finalP1 = currentPlayer === 'p1' ? scores.p1 + moveScore : scores.p1;
            const finalP2 = currentPlayer === 'p2' ? scores.p2 + moveScore : scores.p2;

            // 勝敗判定と理由の設定（遅延なしで即座に計算）
            let pendingWinner;
            let pendingScores;
            let reason;

            if (isSoloMode) {
                // SOLO MODE RULE: Ending with red piece = 0 points
                if (hasRed) {
                    pendingScores = { p1: 0, p2: 0 };
                    reason = '最後に赤コマを取ったため、スコアは0点です';
                } else {
                    pendingScores = { p1: finalP1, p2: finalP2 };
                    reason = 'これ以上動かせるコマがありません';
                }
                pendingWinner = 'SOLO';
            } else {
                // VS MODE (CPU / 2PLAYERS) ルール
                let winnerPlayer;
                let loserPlayer;

                if (hasRed) {
                    // 最後に赤を取った場合は負け（自爆ルール）
                    winnerPlayer = playerWhoMadeLastMove === 1 ? 2 : 1;
                    loserPlayer = playerWhoMadeLastMove;
                    const loserName = getPlayerLabel(loserPlayer);
                    const winnerName = getPlayerLabel(winnerPlayer);
                    reason = `${loserName}が赤コマを取ったため、${winnerName}の勝ち！`;
                } else {
                    // 通常は最後に手を打った方が勝ち
                    winnerPlayer = playerWhoMadeLastMove;
                    loserPlayer = playerWhoMadeLastMove === 1 ? 2 : 1;
                    const loserName = getPlayerLabel(loserPlayer);
                    const winnerName = getPlayerLabel(winnerPlayer);
                    reason = `${loserName}が詰まり、${winnerName}の勝ち！`;
                }

                pendingWinner = winnerPlayer;

                // 敗者のスコアを0点にする
                if (loserPlayer === 1) {
                    pendingScores = { p1: 0, p2: finalP2 };
                } else {
                    pendingScores = { p1: finalP1, p2: 0 };
                }
            }

            // 勝敗理由を即座に表示
            setGameOverReason(reason);
            setLastActionMessage(reason);

            // 1.5秒後に結果画面を表示
            setTimeout(() => {
                setScores(pendingScores);
                setWinner(pendingWinner);
                setPhase('GAME_OVER');
                setIsGameOverPending(false);
                setLastMoveHighlight(null);
            }, 1500);
        }
    };

    const handleSpotClick = (index) => {
        if (phase === 'GAME_OVER') return;
        if (isCPUMode && turn === 2) return; // Block input during CPU turn

        if (phase === 'REMOVING') {
            if (board[index] !== null) {
                const removedColor = board[index];

                // ALL MODES RULE: Cannot remove red piece at the start
                if (removedColor === 'RED') {
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
    // replayStep: 表示済みの手数（0 = 初期状態、1 = 1手目の結果表示済み、...）
    const startReplay = () => {
        if (moveHistory.length === 0) return;
        setIsReplaying(true);
        setReplayStep(0); // 0手表示済み = 初期状態
        setReplayScores({ p1: 0, p2: 0 }); // 開始時はスコア0
        setReplayTurn(1); // 最初はプレイヤー1のターン
        // Reset board to initial state (before first move)
        if (moveHistory[0]) {
            setBoard(moveHistory[0].boardBefore);
        }

        // リプレイ開始時に勝敗理由を計算して表示
        const lastMove = moveHistory[moveHistory.length - 1];
        if (lastMove) {
            const capturedColor = lastMove.capturedColor;
            const hasRed = capturedColor === 'RED';
            let reason;

            if (isSoloMode) {
                if (hasRed) {
                    reason = '最後に赤コマを取ったため、スコアは0点です';
                } else {
                    reason = 'これ以上動かせるコマがありません';
                }
            } else {
                let loserPlayer;
                let winnerPlayer;
                if (hasRed) {
                    loserPlayer = lastMove.player;
                    winnerPlayer = lastMove.player === 1 ? 2 : 1;
                } else {
                    winnerPlayer = lastMove.player;
                    loserPlayer = lastMove.player === 1 ? 2 : 1;
                }
                const loserName = getPlayerLabel(loserPlayer);
                const winnerName = getPlayerLabel(winnerPlayer);
                if (hasRed) {
                    reason = `${loserName}が赤コマを取ったため、${winnerName}の勝ち！`;
                } else {
                    reason = `${loserName}が詰まり、${winnerName}の勝ち！`;
                }
            }
            setGameOverReason(reason);
            setLastActionMessage(reason);
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
        // replayStepは現在表示済みの手数。次のmoveHistory[replayStep]を表示する
        if (replayStep < moveHistory.length) {
            const currentMoveIndex = replayStep; // これから表示する手
            const move = moveHistory[currentMoveIndex];

            // まず盤面を更新（コマの移動）
            setBoard(move.boardAfter);

            // コマ移動中は、その手を打ったプレイヤーを表示（移動のエフェクト中はまだその人のターン）
            setReplayTurn(move.player);

            // 表示済み手数を増やす
            setReplayStep(replayStep + 1);

            // スコアを遅延して更新（コマ移動後にスコア加算）
            const isLastMove = currentMoveIndex === moveHistory.length - 1;

            setTimeout(() => {
                // スコア更新
                let newScores;
                if (move.totalScores) {
                    newScores = { ...move.totalScores };
                } else {
                    // 古い履歴などでtotalScoresがない場合のフォールバック
                    const playerKey = move.player === 1 ? 'p1' : 'p2';
                    newScores = {
                        p1: move.player === 1 ? move.score : 0,
                        p2: move.player === 2 ? move.score : 0
                    };
                }

                // 最後の手の場合、敗者のスコアを0にし、勝敗理由を表示する
                if (isLastMove) {
                    const capturedColor = move.capturedColor;
                    const hasRed = capturedColor === 'RED';

                    if (isSoloMode) {
                        // ソロモードの勝敗理由
                        if (hasRed) {
                            newScores.p1 = 0;
                            newScores.p2 = 0;
                            setLastActionMessage('最後に赤コマを取ったため、スコアは0点です');
                            setGameOverReason('最後に赤コマを取ったため、スコアは0点です');
                        } else {
                            setLastActionMessage('これ以上動かせるコマがありません');
                            setGameOverReason('これ以上動かせるコマがありません');
                        }
                    } else {
                        // VSモードの勝敗理由
                        let loserPlayer;
                        let winnerPlayer;
                        if (hasRed) {
                            loserPlayer = move.player;
                            winnerPlayer = move.player === 1 ? 2 : 1;
                        } else {
                            winnerPlayer = move.player;
                            loserPlayer = move.player === 1 ? 2 : 1;
                        }

                        // 敗者のスコアを0にする
                        if (loserPlayer === 1) {
                            newScores.p1 = 0;
                        } else {
                            newScores.p2 = 0;
                        }

                        // 勝敗理由のメッセージを設定
                        const loserName = getPlayerLabel(loserPlayer);
                        const winnerName = getPlayerLabel(winnerPlayer);
                        let reason;
                        if (hasRed) {
                            reason = `${loserName}が赤コマを取ったため、${winnerName}の勝ち！`;
                        } else {
                            reason = `${loserName}が詰まり、${winnerName}の勝ち！`;
                        }
                        setLastActionMessage(reason);
                        setGameOverReason(reason);
                    }
                }

                setReplayScores(newScores);

                // スコア加算と同時にターンを次に回す（移動完了）
                // ただし赤コマ獲得時（連続手番）はそのまま
                const capturedColor = move.capturedColor;
                const hasRed = capturedColor === 'RED';
                // 次のターンのプレイヤー：赤を取ったら同じ人、そうでなければ交代
                const nextTurnPlayer = hasRed ? move.player : (move.player === 1 ? 2 : 1);
                setReplayTurn(nextTurnPlayer);

            }, 300); // 300ms遅延（アニメーション完了待ち）
        }
    };

    const prevReplayStep = () => {
        if (replayStep > 1) {
            // 1手前の状態を表示
            const prevMoveIndex = replayStep - 2; // 1つ前の手
            const move = moveHistory[prevMoveIndex];

            setBoard(move.boardAfter);
            setReplayTurn(move.player);
            if (move.totalScores) {
                setReplayScores(move.totalScores);
            }
            setReplayStep(replayStep - 1);
        } else if (replayStep === 1) {
            // 初期状態に戻る
            setBoard(moveHistory[0].boardBefore);
            setReplayScores({ p1: 0, p2: 0 });
            setReplayTurn(1);
            setReplayStep(0);
        }
    };

    const jumpToReplayStep = (step) => {
        if (step === 0) {
            // 初期状態
            setBoard(moveHistory[0].boardBefore);
            setReplayScores({ p1: 0, p2: 0 });
            setReplayTurn(1);
            setReplayStep(0);
        } else if (step > 0 && step <= moveHistory.length) {
            const moveIndex = step - 1;
            const move = moveHistory[moveIndex];
            setBoard(move.boardAfter);
            setReplayTurn(move.player);
            if (move.totalScores) {
                setReplayScores(move.totalScores);
            }
            setReplayStep(step);
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
        replayScores,
        replayTurn,
        startReplay,
        stopReplay,
        nextReplayStep,
        prevReplayStep,
        jumpToReplayStep,
        // TRYPAS notification
        showTrypas,
        // Game over delay and reason
        isGameOverPending,
        gameOverReason,
        lastMoveHighlight,
        // Hint generation
        getGameHint
    };
};

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

    const isCPUMode = gameMode.startsWith('CPU_');
    const isSoloMode = gameMode === 'SOLO';

    // Initialize board
    const initializeBoard = useCallback(() => {
        let pieces = [];
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

        setBoard(pieces);
        setTurn(1);
        setScores({ p1: 0, p2: 0 });
        setPhase('REMOVING');
        setSelectedSpot(null);
        setValidMoves([]);
        setWinner(null);
        setLastActionMessage('');
    }, []);

    useEffect(() => {
        initializeBoard();
    }, [initializeBoard]);

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

        // Update score
        const currentPlayer = turn === 1 ? 'p1' : 'p2';
        setScores(prev => ({
            ...prev,
            [currentPlayer]: prev[currentPlayer] + moveScore
        }));

        // Check Red Bonus
        if (hasRed) {
            setLastActionMessage(`${isCPUMode && turn === 2 ? 'CPU' : `Player ${turn}`} gets EXTRA TURN! (Red Piece)`);
            // Turn does not change
        } else {
            setLastActionMessage('');
            if (!isSoloMode) {
                setTurn(prev => prev === 1 ? 2 : 1);
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
                setWinner('SOLO'); // Special case for solo mode
            } else if (finalP1 > finalP2) {
                setWinner(1);
            } else if (finalP2 > finalP1) {
                setWinner(2);
            } else {
                setWinner('DRAW');
            }
        }
    };

    const handleSpotClick = (index) => {
        if (phase === 'GAME_OVER') return;
        if (isCPUMode && turn === 2) return; // Block input during CPU turn

        if (phase === 'REMOVING') {
            if (board[index] !== null) {
                const newBoard = [...board];
                newBoard[index] = null;
                setBoard(newBoard);
                setPhase('PLAYING');

                if (isCPUMode) {
                    setTurn(2); // CPU goes first in CPU mode
                } else if (isSoloMode) {
                    setTurn(1); // Solo stays on P1
                } else {
                    setTurn(2); // P2 goes first in local mode
                }
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

    const resetGame = () => {
        initializeBoard();
    };

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
        resetGame
    };
};

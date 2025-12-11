import React from 'react';
import { motion } from 'framer-motion';
import Piece from './Piece';
import { SPOT_COORDINATES } from '../constants/rules';

const GameBoard = ({ board, onSpotClick, selectedSpot, validMoves, highlightSpots = [] }) => {
    // Draw lines connecting valid jumps (adjacent logic is implicit in jumps for visual?)
    // Actually, we should draw the grid lines.
    // The grid is defined by the connections.
    // We can iterate VALID_JUMPS to draw lines, but that might duplicate lines.
    // Let's define unique connections for drawing.
    // Horizontal: 1-2, 3-4, 4-5, 6-7, 7-8, 8-9, 10-11, ...
    // Diagonals.
    // Or just iterate all VALID_JUMPS and draw lines if distance is "1 step" (adjacent).
    // But VALID_JUMPS are "jumps" (distance 2).
    // We need adjacency for lines.
    // Let's use a manual set of lines for the triangle grid.

    const connections = [
        // Horizontal
        [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [8, 9], [10, 11], [11, 12], [12, 13], [13, 14],
        // Diagonal /
        [0, 2], [2, 5], [5, 9], [9, 14],
        [1, 4], [4, 8], [8, 13],
        [3, 7], [7, 12],
        [6, 11],
        // Diagonal \
        [0, 1], [1, 3], [3, 6], [6, 10],
        [2, 4], [4, 7], [7, 11],
        [5, 8], [8, 12],
        [9, 13]
    ];

    return (
        <div className="relative w-full max-w-md aspect-[1/0.9] mx-auto p-4 select-none">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {connections.map(([start, end], i) => {
                    const s = SPOT_COORDINATES[start];
                    const e = SPOT_COORDINATES[end];
                    return (
                        <line
                            key={i}
                            x1={`${s.x}%`}
                            y1={`${s.y}%`}
                            x2={`${e.x}%`}
                            y2={`${e.y}%`}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    );
                })}
            </svg>

            {SPOT_COORDINATES.map((coord, index) => {
                const isSelected = selectedSpot === index;
                const isValidMove = validMoves.some(m => m.end === index);
                const isHighlighted = highlightSpots.includes(index);
                const pieceColor = board[index];

                return (
                    <div
                        key={index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 w-[12%] h-[13%]" // Responsive size
                        style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                    >
                        {/* Tutorial Highlight Ring */}
                        {isHighlighted && (
                            <motion.div
                                className="absolute inset-[-4px] rounded-full border-4 border-emerald-400 pointer-events-none"
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.8, 1, 0.8],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 10px rgba(16, 185, 129, 0.3)',
                                }}
                            />
                        )}

                        {/* Spot marker (empty hole) */}
                        <div
                            className={`absolute inset-0 rounded-full border-2 transition-colors duration-300
                ${isValidMove
                                    ? 'border-yellow-400 bg-yellow-400/20 cursor-pointer animate-pulse'
                                    : isHighlighted && !pieceColor
                                        ? 'border-emerald-400 bg-emerald-400/20 cursor-pointer'
                                        : 'border-white/10 bg-black/20'
                                }`}
                            onClick={() => (isValidMove || isHighlighted) && onSpotClick(index)}
                        />

                        {/* Piece */}
                        {pieceColor && (
                            <div className="absolute inset-0 p-1">
                                <Piece
                                    color={pieceColor}
                                    isSelected={isSelected}
                                    onClick={() => onSpotClick(index)}
                                    isHighlighted={isHighlighted}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default GameBoard;

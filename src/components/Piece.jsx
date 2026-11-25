import React from 'react';
import { motion } from 'framer-motion';
import { PIECE_COLORS, PIECE_NUMBERS } from '../constants/colors';

const Piece = ({ color, isSelected, onClick, isHighlighted = false }) => {
    return (
        <motion.div
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: isSelected ? 1.2 : 1,
                opacity: 1,
                y: isSelected ? -10 : 0,
                boxShadow: isSelected
                    ? `0 10px 20px ${PIECE_COLORS[color]}80`
                    : `0 4px 6px rgba(0,0,0,0.3)`
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-full rounded-full cursor-pointer relative"
            style={{
                backgroundColor: PIECE_COLORS[color],
                border: '2px solid rgba(255,255,255,0.2)',
            }}
            onClick={onClick}
        >
            {/* Inner highlight for 3D effect */}
            <div className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white opacity-30 blur-[1px]" />

            {/* コマの数字（コマの大きさに合わせて伸び縮みする） */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                viewBox="0 0 100 100"
                aria-hidden="true"
            >
                <text
                    x="50"
                    y="50"
                    dy="0.35em"
                    textAnchor="middle"
                    fontSize="58"
                    fontWeight="900"
                    fill="#111827"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="3"
                    paintOrder="stroke"
                    style={{ fontFamily: 'inherit' }}
                >
                    {PIECE_NUMBERS[color]}
                </text>
            </svg>
        </motion.div>
    );
};

export default Piece;

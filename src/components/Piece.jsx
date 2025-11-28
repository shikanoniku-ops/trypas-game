import React from 'react';
import { motion } from 'framer-motion';
import { PIECE_COLORS } from '../constants/colors';

const Piece = ({ color, isSelected, onClick }) => {
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
        </motion.div>
    );
};

export default Piece;

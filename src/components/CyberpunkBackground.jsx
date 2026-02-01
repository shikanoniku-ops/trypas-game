import React from 'react';
import { motion } from 'framer-motion';

// Hexagon Background Pattern
const HexagonPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="hexagons-game" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <polygon
                    points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-cyan-400"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons-game)" />
    </svg>
);

// Neural Network Lines
const NeuralLines = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                style={{
                    top: `${10 + i * 18}%`,
                    left: '-5%',
                    right: '-5%',
                }}
                animate={{
                    opacity: [0.1, 0.4, 0.1],
                    scaleX: [0.9, 1, 0.9],
                }}
                transition={{
                    duration: 4 + i * 0.8,
                    repeat: Infinity,
                    delay: i * 0.5,
                }}
            />
        ))}
    </div>
);

// Main Cyberpunk Background Component - Same as TitleScreen
const CyberpunkBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#080810] to-gray-950" />

            {/* Hexagon pattern */}
            <HexagonPattern />

            {/* Neural network lines */}
            <NeuralLines />

            {/* Floating orbs - same as TitleScreen */}
            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, -25, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    x: [0, -35, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/12 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-500/8 rounded-full blur-[80px]"
            />

            {/* Scan lines overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.03,
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)'
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>
    );
};

export default CyberpunkBackground;

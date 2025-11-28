import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScoreBoard = ({ scores, turn, phase, lastActionMessage, gameMode }) => {
    const isCPUMode = gameMode?.startsWith('CPU_');
    const isSoloMode = gameMode === 'SOLO';

    return (
        <div className="flex flex-col w-full max-w-md mx-auto mb-2 px-4">
            {/* Message Area */}
            <div className="h-6 mb-2 text-center">
                <AnimatePresence mode="wait">
                    {lastActionMessage && (
                        <motion.div
                            key={lastActionMessage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm font-bold text-yellow-400"
                        >
                            {lastActionMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between items-center">
                {/* Player 1 */}
                <motion.div
                    animate={{
                        scale: turn === 1 ? 1.1 : 1,
                        opacity: turn === 1 ? 1 : 0.6,
                        borderColor: turn === 1 ? '#FF6B6B' : 'transparent'
                    }}
                    className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-md border-2 transition-colors w-24"
                >
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">P1</span>
                    <span className="text-2xl font-black text-white">{scores.p1}</span>
                </motion.div>

                {/* Turn Indicator / Phase Info */}
                <div className="flex flex-col items-center flex-grow px-4">
                    <span className="text-xs text-gray-400 mb-1">
                        {phase === 'REMOVING' ? 'セットアップ' : '現在のターン'}
                    </span>
                    <div className="text-xl font-bold text-white text-center">
                        {phase === 'REMOVING' ? (
                            <span className="text-yellow-400 animate-pulse text-sm">駒を1つ取り除く</span>
                        ) : isSoloMode ? (
                            <span style={{ color: '#FF6B6B' }}>SOLO PLAY</span>
                        ) : (
                            <span style={{ color: turn === 1 ? '#FF6B6B' : '#4ECDC4' }}>
                                {turn === 1 ? 'PLAYER 1' : (isCPUMode ? 'CPU' : 'PLAYER 2')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Player 2 / CPU (hidden in solo mode) */}
                {!isSoloMode && (
                    <motion.div
                        animate={{
                            scale: turn === 2 ? 1.1 : 1,
                            opacity: turn === 2 ? 1 : 0.6,
                            borderColor: turn === 2 ? '#4ECDC4' : 'transparent'
                        }}
                        className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-md border-2 transition-colors w-24"
                    >
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                            {isCPUMode ? 'CPU' : 'P2'}
                        </span>
                        <span className="text-2xl font-black text-white">{scores.p2}</span>
                    </motion.div>
                )}

                {/* Spacer for solo mode to keep P1 on left */}
                {isSoloMode && <div className="w-24"></div>}
            </div>
        </div>
    );
};

export default ScoreBoard;

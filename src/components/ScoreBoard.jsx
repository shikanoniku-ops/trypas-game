import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECE_COLORS } from '../constants/colors';

const PlayerCard = ({ label, score, isActive, isWinner, totalTime, colorClass, borderClass, align = 'left', compact = false }) => {
    return (
        <motion.div
            animate={{
                scale: isActive ? (compact ? 1.02 : 1.05) : 1,
                opacity: isActive ? 1 : 0.7,
                y: isActive ? -2 : 0
            }}
            className={`
                relative flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} 
                ${compact ? 'p-2 min-w-[100px] max-w-[120px]' : 'p-4 w-full max-w-[160px]'}
                rounded-xl bg-gray-900/60 backdrop-blur-xl border 
                transition-all duration-300 overflow-hidden shadow-lg
            `}
            style={{
                borderColor: isActive ? borderClass : 'rgba(255,255,255,0.05)',
                boxShadow: isActive
                    ? `0 0 15px ${borderClass}30, inset 0 0 5px ${borderClass}10`
                    : '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                '--glow-color': borderClass
            }}
        >
            {/* Active Glow Background */}
            {isActive && (
                <>
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                        style={{ background: `radial-gradient(circle at ${align === 'right' ? '0%' : '100%'} 0%, ${borderClass}, transparent 60%)` }}
                    />
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40" />
                </>
            )}

            {/* Label */}
            <span
                className={`font-bold tracking-[0.15em] uppercase mb-0.5 ${compact ? 'text-[8px]' : 'text-[10px]'} ${isActive ? 'text-white' : 'text-gray-500'}`}
                style={{ textShadow: isActive ? `0 0 8px ${borderClass}` : 'none' }}
            >
                {label}
            </span>

            {/* Score - Compact Neon Effect */}
            <div className="flex items-baseline gap-1">
                <span
                    className={`${compact ? 'text-2xl' : 'text-4xl'} font-black text-white leading-none`}
                    style={{
                        fontFamily: '"Inter", sans-serif',
                        textShadow: isActive
                            ? `0 0 8px ${borderClass}, 0 0 16px ${borderClass}`
                            : '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                >
                    {score}
                </span>
                <span className={`${compact ? 'text-[8px]' : 'text-[10px]'} font-bold text-gray-500 tracking-wider transform translate-y-[-2px]`}>PTS</span>
            </div>

            {/* Time (for VS modes) */}
            {totalTime !== undefined && (
                <div className={`mt-1 flex items-center gap-1 ${compact ? 'text-[9px]' : 'text-[10px]'} font-mono ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                    <span>TIME:</span>
                    <span>{totalTime}</span>
                </div>
            )}
        </motion.div>
    );
};

const ScoreBoard = ({
    scores,
    turn,
    phase,
    lastActionMessage,
    gameMode,
    totalThinkingTime,
    isReplaying,
    compactMode = false
}) => {
    const isCPUMode = gameMode?.startsWith('CPU_');
    const isSoloMode = gameMode === 'SOLO';

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusMessage = () => {
        if (phase === 'REMOVING') return 'セットアップ';
        if (isReplaying) return 'リプレイ';
        if (isSoloMode) return 'SOLO PLAY';
        return turn === 1 ? 'P1 ターン' : (isCPUMode ? 'CPU ターン' : 'P2 ターン');
    };

    const getStatusColor = () => {
        if (phase === 'REMOVING') return 'text-yellow-400';
        if (isSoloMode) return 'text-blue-400';
        return turn === 1 ? 'text-blue-400' : 'text-rose-400';
    };

    return (
        <div className="w-full max-w-lg mx-auto mb-2 px-2">
            {/* Status Bar / Notification - Compact */}
            {!compactMode && (
                <div className="flex justify-center mb-3">
                    <div className="relative group">
                        <div
                            className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-full border border-gray-700/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                            style={{
                                borderColor: phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.3)' : (turn === 1 ? 'rgba(96, 165, 250, 0.3)' : 'rgba(251, 113, 133, 0.3)'),
                                boxShadow: `0 0 20px ${phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.1)' : (turn === 1 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(251, 113, 133, 0.1)')}`
                            }}
                        />
                        <div className="relative px-6 py-1.5 flex items-center gap-3">
                            <div
                                className={`w-2 h-2 rounded-full ${phase === 'REMOVING' ? 'bg-yellow-400 animate-pulse' : (turn === 1 ? 'bg-blue-400' : 'bg-rose-400')}`}
                                style={{ boxShadow: phase === 'REMOVING' ? '0 0 8px #FACC15' : (turn === 1 ? '0 0 8px #60A5FA' : '0 0 8px #FB7185') }}
                            />
                            <span
                                className={`text-xs font-bold tracking-widest uppercase ${getStatusColor()}`}
                                style={{ textShadow: '0 0 15px currentColor' }}
                            >
                                {getStatusMessage()}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Score Area - Compact Layout */}
            <div className="flex justify-center items-stretch gap-3">
                {/* Player 1 Card */}
                <PlayerCard
                    label="P1"
                    score={scores.p1}
                    isActive={turn === 1 || isSoloMode}
                    totalTime={!isSoloMode ? formatTime(totalThinkingTime.p1) : undefined}
                    colorClass="text-blue-400"
                    borderClass="#60A5FA" // blue-400
                    align="left"
                    compact={compactMode}
                />

                {/* VS Badge (Center) - Hidden in Solo, Simplified */}
                {!isSoloMode && (
                    <div className="flex flex-col justify-center items-center px-1">
                        <div className="w-[1px] h-6 bg-gray-700/50 mb-1"></div>
                        <span className="text-xs font-black text-gray-600 italic">VS</span>
                        <div className="w-[1px] h-6 bg-gray-700/50 mt-1"></div>
                    </div>
                )}

                {/* Player 2 / CPU Card - Hidden in Solo */}
                {!isSoloMode && (
                    <PlayerCard
                        label={isCPUMode ? "CPU" : "P2"}
                        score={scores.p2}
                        isActive={turn === 2}
                        totalTime={formatTime(totalThinkingTime.p2)}
                        colorClass="text-rose-400"
                        borderClass="#FB7185" // rose-400
                        align="right"
                        compact={compactMode}
                    />
                )}
            </div>

            {/* Last Action Message Toast - Compact */}
            <div className="h-6 mt-2 flex justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    {!isSoloMode && lastActionMessage && (
                        <motion.div
                            key={lastActionMessage}
                            initial={{ opacity: 0, y: 5, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.9 }}
                            className="bg-gray-800/90 text-white px-3 py-1 rounded-md text-[10px] font-medium border border-gray-700 shadow-lg flex items-center gap-1.5"
                        >
                            <span className="text-yellow-400 text-xs">ℹ️</span>
                            {lastActionMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ScoreBoard;

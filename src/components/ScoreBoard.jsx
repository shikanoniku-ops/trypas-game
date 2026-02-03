import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECE_COLORS } from '../constants/colors';

// プレイヤーカードコンポーネント（固定サイズ）
const PlayerCard = ({ label, score, isActive, isWinner, totalTime, colorClass, borderClass, align = 'left', compact = false }) => {
    return (
        <div
            className={`
                relative flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} 
                ${compact ? 'p-2 w-[100px]' : 'p-4 w-[160px]'}
                rounded-xl bg-gray-900/60 backdrop-blur-xl border 
                transition-colors duration-300 overflow-hidden shadow-lg
            `}
            style={{
                borderColor: isActive ? borderClass : 'rgba(255,255,255,0.05)',
                boxShadow: isActive
                    ? `0 0 15px ${borderClass}30, inset 0 0 5px ${borderClass}10`
                    : '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                opacity: isActive ? 1 : 0.7
            }}
        >
            {/* アクティブ時の背景グロー */}
            {isActive && (
                <>
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                        style={{ background: `radial-gradient(circle at ${align === 'right' ? '0%' : '100%'} 0%, ${borderClass}, transparent 60%)` }}
                    />
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40" />
                </>
            )}

            {/* ラベル */}
            <span
                className={`font-bold tracking-[0.15em] uppercase mb-0.5 ${compact ? 'text-[8px]' : 'text-[10px]'} ${isActive ? 'text-white' : 'text-gray-500'}`}
                style={{ textShadow: isActive ? `0 0 8px ${borderClass}` : 'none' }}
            >
                {label}
            </span>

            {/* スコア表示 */}
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
                <span className={`${compact ? 'text-[8px]' : 'text-[10px]'} font-bold text-gray-500 tracking-wider`}>PTS</span>
            </div>
        </div>
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
        // 固定サイズのコンテナ（レイアウトシフト防止）
        <div className={`w-full ${compactMode ? '' : 'max-w-lg'} mx-auto mb-2 ${compactMode ? 'px-0' : 'px-2'}`}>
            {/* ステータスバー */}
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

            {/* スコアエリア（メッセージ用のパディングを確保） */}
            <div className="relative pb-14">
                {/* スコアカード行 */}
                <div className="flex justify-center items-center gap-3">
                    {/* プレイヤー1カード */}
                    <PlayerCard
                        label="P1"
                        score={scores.p1}
                        isActive={turn === 1 || isSoloMode}
                        colorClass="text-blue-400"
                        borderClass="#60A5FA"
                        align="left"
                        compact={compactMode}
                    />

                    {/* VS表示（ソロモード以外） */}
                    {!isSoloMode && (
                        <div className="flex flex-col justify-center items-center w-[40px]">
                            <div className="w-[1px] h-4 bg-white/60"></div>
                            <span className="text-xs font-black text-white italic my-1">VS</span>
                            <div className="w-[1px] h-4 bg-white/60"></div>
                        </div>
                    )}

                    {/* プレイヤー2/CPUカード（ソロモード以外） */}
                    {!isSoloMode && (
                        <PlayerCard
                            label={isCPUMode ? "CPU" : "P2"}
                            score={scores.p2}
                            isActive={turn === 2}
                            colorClass="text-rose-400"
                            borderClass="#FB7185"
                            align="right"
                            compact={compactMode}
                        />
                    )}
                </div>

                {/* メッセージエリア（絶対位置でレイアウトに影響しない） */}
                <div className="absolute bottom-0 left-0 right-0 h-12 flex justify-center items-center">
                    <AnimatePresence mode="wait">
                        {lastActionMessage && (
                            <motion.div
                                key={lastActionMessage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`text-white px-4 py-2 rounded-lg text-sm font-bold border-2 shadow-xl flex items-center gap-2 ${isReplaying
                                    ? 'bg-cyan-900/95 border-cyan-400 shadow-cyan-500/30'
                                    : 'bg-gray-800/95 border-gray-600'
                                    }`}
                            >
                                <span className="text-base">{isReplaying ? '🏆' : 'ℹ️'}</span>
                                {lastActionMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ScoreBoard;


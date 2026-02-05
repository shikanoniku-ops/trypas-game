import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerCard = ({ label, score, isActive, colorClass, borderClass, align = 'left', compact = false }) => {
    // スクリーンショットに忠実なスタイル定義
    return (
        <div
            className={`
                relative flex flex-col justify-between
                ${compact ? 'p-3 w-[120px] h-[70px] sm:w-[140px] sm:h-[80px]' : 'p-4 w-[160px] h-[90px]'}
                rounded-xl border
                transition-all duration-300
            `}
            style={{
                backgroundColor: isActive ? 'rgba(8, 30, 50, 0.6)' : 'rgba(10, 10, 14, 0.6)',
                borderColor: isActive ? borderClass : 'rgba(255,255,255,0.08)',
                boxShadow: isActive ? `0 0 12px ${borderClass}30, inset 0 0 10px ${borderClass}10` : 'none',
            }}
        >
            {/* ラベル */}
            <span
                className={`font-black tracking-widest uppercase ${compact ? 'text-[10px]' : 'text-xs'} ${isActive ? 'text-white' : 'text-gray-500'}`}
                style={{ textShadow: isActive ? `0 0 10px ${borderClass}80` : 'none' }}
            >
                {label}
            </span>

            {/* スコア表示 */}
            <div className={`flex items-baseline gap-1 ${align === 'right' ? 'self-end' : 'self-start'}`}>
                <span
                    className={`${compact ? 'text-3xl' : 'text-4xl'} font-black text-white leading-none`}
                    style={{
                        fontFamily: '"Rajdhani", "Inter", sans-serif',
                        textShadow: isActive ? `0 0 15px ${borderClass}60` : 'none'
                    }}
                >
                    {score}
                </span>
                <span className="text-[10px] font-bold text-gray-500 font-mono">PTS</span>
            </div>

            {/* アクティブ時のグローエフェクト */}
            {isActive && (
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ background: `radial-gradient(circle at ${align === 'right' ? 'top right' : 'bottom left'}, ${borderClass}20, transparent 60%)` }}
                />
            )}
        </div>
    );
};

const ScoreBoard = ({
    scores,
    turn,
    phase,
    lastActionMessage,
    gameMode,
    isReplaying,
    compactMode = false
}) => {
    const isCPUMode = gameMode?.startsWith('CPU_');
    const isSoloMode = gameMode === 'SOLO';

    return (
        <div className={`w-full ${compactMode ? '' : 'max-w-lg'} mx-auto mb-2 ${compactMode ? 'px-0' : 'px-2'}`}>
            <div className="flex justify-center items-center gap-4">
                {/* プレイヤー1カード */}
                <PlayerCard
                    label={isCPUMode ? "YOU" : "PLAYER 1"}
                    score={scores.p1}
                    isActive={turn === 1 || isSoloMode}
                    colorClass="text-cyan-400"
                    borderClass="#3B82F6" // スクリーンショットの青に近い色
                    align="left"
                    compact={compactMode}
                />

                {/* VS表示 */}
                {!isSoloMode && (
                    <div className="flex flex-col justify-center items-center h-full gap-2 opacity-80">
                        <div className="w-[1px] h-3 bg-gray-500"></div>
                        <span className="text-sm font-black text-white italic font-mono tracking-wider">VS</span>
                        <div className="w-[1px] h-3 bg-gray-500"></div>
                    </div>
                )}

                {/* プレイヤー2/CPUカード */}
                {!isSoloMode && (
                    <PlayerCard
                        label={isCPUMode ? "CPU" : "PLAYER 2"}
                        score={scores.p2}
                        isActive={turn === 2}
                        colorClass="text-red-400"
                        borderClass="#3B82F6"
                        align="right"
                        compact={compactMode}
                    />
                )}
            </div>

            {/* メッセージ表示エリア */}

        </div>
    );
};

export default ScoreBoard;

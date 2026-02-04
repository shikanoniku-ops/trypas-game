import React from 'react';
import { PIECE_COLORS, PIECE_SCORES } from '../constants/colors';

/**
 * ゲーム画面下部の凡例コンポーネント
 * 各色とその得点を表示
 */
const Legend = ({ className = '' }) => {
    // 表示順序（得点順）
    const legendItems = [
        { key: 'RED', score: PIECE_SCORES.RED, color: PIECE_COLORS.RED },
        { key: 'YELLOW', score: PIECE_SCORES.YELLOW, color: PIECE_COLORS.YELLOW },
        { key: 'GREEN', score: PIECE_SCORES.GREEN, color: PIECE_COLORS.GREEN },
        { key: 'BLUE', score: PIECE_SCORES.BLUE, color: PIECE_COLORS.BLUE },
        { key: 'WHITE', score: PIECE_SCORES.WHITE, color: PIECE_COLORS.WHITE },
    ];

    return (
        <div className={`
            px-6 py-3 rounded-full border border-gray-700/50 
            bg-gray-900/60 backdrop-blur-md shadow-sm
            w-full flex justify-between items-center text-sm
            ${className}
        `}>
            {legendItems.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                    {/* Dot */}
                    <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                    />
                    {/* Score Text */}
                    <span className="font-mono font-bold text-gray-300">
                        {item.score}<span className="text-xs opacity-70 ml-0.5">点</span>
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Legend;

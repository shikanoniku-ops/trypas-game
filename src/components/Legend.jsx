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
        <div className={`px-4 py-2 bg-gray-800/80 rounded-full border border-gray-700 w-full flex justify-between items-center text-xs ${className}`}>
            {legendItems.map((item) => (
                <div key={item.key} className="flex items-center gap-1">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{
                            backgroundColor: item.color,
                            boxShadow: `0 0 8px ${item.color}`,
                        }}
                    />
                    <span className="text-gray-300 font-bold">{item.score}点</span>
                </div>
            ))}
        </div>
    );
};

export default Legend;

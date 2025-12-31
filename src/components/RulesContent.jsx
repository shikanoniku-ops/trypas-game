import React from 'react';
import { PIECE_COLORS, PIECE_SCORES } from '../constants/colors';

/**
 * ルール説明のコンテンツ部分（共通コンポーネント）
 * TitleScreen.jsx と App.jsx の両方で使用
 */
const RulesContent = () => {
    // 得点表の順序（白から赤へ、高得点順）
    const scoreOrder = [
        { key: 'WHITE', label: '白', tailwindColor: 'text-white', score: 50 },
        { key: 'BLUE', label: '青', tailwindColor: 'text-blue-400', score: 40 },
        { key: 'GREEN', label: '緑', color: PIECE_COLORS.GREEN, score: 30 },
        { key: 'YELLOW', label: '黄', tailwindColor: 'text-yellow-400', score: 20 },
        { key: 'RED', label: '赤', tailwindColor: 'text-red-400', score: 10 },
    ];

    return (
        <div className="space-y-6 text-gray-300 leading-relaxed text-sm">
            {/* タイトル */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">TRYPAS SOLOPLAY</h2>
            </div>

            {/* ソロプレイとは */}
            <section className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                    <span className="text-xl">🎯</span> ソロプレイとは
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                    対戦ゲームTRYPASの練習モード。高得点を目指すパズルです。
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    ※対戦ゲームは2026年にリリース予定です。
                </p>
            </section>

            {/* 遊び方 */}
            <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    遊び方
                </h3>

                {/* STEP 1: リムービング */}
                <div className="mb-4">
                    <h4 className="text-base font-bold text-blue-300 mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                        <span className="text-blue-400 font-bold">STEP 1</span>
                        リムービング
                    </h4>
                    <div className="bg-gray-700/20 p-4 rounded-xl border border-gray-700">
                        <p className="text-sm text-white">
                            好きなコマを1つ取り除きます（赤以外）
                        </p>
                    </div>
                </div>

                {/* STEP 2: プレイング */}
                <div className="mb-4">
                    <h4 className="text-base font-bold text-blue-300 mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                        <span className="text-blue-400 font-bold">STEP 2</span>
                        プレイング
                    </h4>
                    <div className="bg-gray-700/20 p-4 rounded-xl border border-gray-700 space-y-3">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            コマを選び、直線上の他のコマ（1〜3個）を飛び越えて<strong className="text-yellow-400">空きスポット</strong>へ移動。飛び越えた最後の1個を取得します。
                        </p>

                        {/* 移動のポイント */}
                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
                            <p className="text-xs font-bold text-white mb-2">移動のポイント</p>
                            <ul className="text-xs text-gray-300 space-y-1">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>飛び越えられるのは <strong className="text-white">1〜3個</strong> まで</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>着地先は必ず <strong className="text-yellow-400">空きスポット</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>移動方向：横(─)、左斜め(／)、右斜め(＼)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* STEP 3: 終了 */}
                <div className="mb-4">
                    <h4 className="text-base font-bold text-blue-300 mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                        <span className="text-blue-400 font-bold">STEP 3</span>
                        終了
                    </h4>
                    <div className="bg-gray-700/20 p-4 rounded-xl border border-gray-700">
                        <p className="text-sm text-white">
                            移動できる手がなくなったら終了
                        </p>
                    </div>
                </div>
            </section>

            {/* 得点 */}
            <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    得点
                </h3>
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-600">
                    {/* Color Labels */}
                    <div className="grid grid-cols-5 text-center text-xs font-bold divide-x divide-gray-700 bg-gray-700/50 p-2">
                        {scoreOrder.map((item) => (
                            <span
                                key={item.key}
                                className={item.tailwindColor || ''}
                                style={item.color ? { color: item.color } : {}}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                    {/* Score Values */}
                    <div className="grid grid-cols-5 text-center text-sm font-bold divide-x divide-gray-700 p-2 bg-gray-900/50">
                        {scoreOrder.map((item) => (
                            <span
                                key={item.key}
                                className={item.tailwindColor || ''}
                                style={item.color ? { color: item.color } : {}}
                            >
                                {item.score}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 赤コマ注意！ */}
            <section className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                <h3 className="text-base font-bold text-red-400 mb-3 flex items-center gap-2">
                    <span className="text-lg">🔴</span> 赤コマ注意！
                </h3>
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <p className="text-sm text-gray-300">最初に取れない</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <p className="text-sm text-gray-300">
                            <strong className="text-red-400">最後に取ると0点</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* 最高得点 */}
            <section className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-5 rounded-xl border border-yellow-500/30">
                <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="text-xl">🏆</span> 最高得点：440点
                </h3>
                <p className="text-sm text-gray-300">
                    赤を1個だけ残して終われば達成！
                </p>
            </section>

            <div className="text-center pt-4 opacity-60">
                <p className="text-[10px] text-gray-500 tracking-tighter">
                    Produced by TRYPAS Development Team / Game Design by Dr. Q
                </p>
            </div>
        </div>
    );

};

export default RulesContent;

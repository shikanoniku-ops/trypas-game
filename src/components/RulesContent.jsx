import React from 'react';
import { PIECE_COLORS, PIECE_SCORES } from '../constants/colors';

/**
 * ルール説明のコンテンツ部分（共通コンポーネント）
 * TitleScreen.jsx と App.jsx の両方で使用
 */
const RulesContent = () => {
    // 色と得点のマッピング（表示順）
    const scoreOrder = [
        { key: 'RED', label: '赤', tailwindColor: 'text-red-400' },
        { key: 'YELLOW', label: '黄', tailwindColor: 'text-yellow-400' },
        { key: 'GREEN', label: '緑', color: PIECE_COLORS.GREEN },
        { key: 'BLUE', label: '青', tailwindColor: 'text-blue-400' },
        { key: 'WHITE', label: '白', tailwindColor: 'text-white' },
    ];

    return (
        <div className="space-y-8 text-gray-300 leading-relaxed text-sm">
            {/* Introductory Text */}
            <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20 text-center">
                <p className="text-blue-300 font-bold mb-1">🧩 思考型パズル「詰めトライパス」</p>
                <p className="text-xs text-gray-400">
                    TRYPASは、盤面のコマを飛び越えて取得し、最終スコアを競うゲームです。
                    ソロモードは高得点や全消しを目指す戦略的なパズルとして楽しめます。
                </p>
            </div>

            {/* Preparation & Goal */}
            <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    基本ルールと得点
                </h3>
                <div className="space-y-3">
                    <p className="text-sm">
                        15個のスポットに、5色×3個（合計15個）のコマがランダムに配置されます。
                    </p>
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
                                    {PIECE_SCORES[item.key]}点
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 1: Removing */}
            <section>
                <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1 flex items-center gap-2">
                    <span className="text-blue-400">STEP 1</span>
                    リムービング (最初の1個)
                </h3>
                <div className="bg-gray-700/20 p-4 rounded-xl border border-gray-700">
                    <p className="text-sm mb-2 text-white font-bold">好きなコマを1つ選んで取り除きます</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        最初に空きスポットを作るための手順です。<br />
                        <span className="text-blue-400">※取り除いたコマの得点も最初から加算されます。</span>この1手でその後の展開が大きく変わります。
                    </p>
                </div>
            </section>

            {/* Step 2: Playing */}
            <section>
                <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1 flex items-center gap-2">
                    <span className="text-blue-400">STEP 2</span>
                    プレイング (移動と取得)
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
                            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">移動のルール</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                選びたいコマを選択し、他のコマを<strong className="text-white">直線上で1〜3個飛び越えて</strong>、その先の空きスポットへ移動します。
                            </p>
                        </div>
                        <div className="bg-gray-700/20 p-3 rounded-lg border border-gray-700/50">
                            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">コマの取得</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                飛び越えたコマのうち、<strong className="text-yellow-400">最後の1個（着地点の直前のコマ）</strong>を取得し、得点が加算されます。
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 text-[10px] items-center">
                        <span className="text-gray-500 font-bold uppercase">有効な方向:</span>
                        <span className="bg-gray-800 px-2 py-1 rounded text-gray-400">水平 (ー)</span>
                        <span className="bg-gray-800 px-2 py-1 rounded text-gray-400">左斜め (／)</span>
                        <span className="bg-gray-800 px-2 py-1 rounded text-gray-400">右斜め (＼)</span>
                    </div>
                </div>
            </section>

            {/* Red Piece Bonus */}
            <section className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
                    <span className="text-lg">🔴</span> 赤コマの特殊ルール
                </h3>
                <div className="space-y-3">
                    <div className="bg-red-900/20 p-3 rounded-lg border border-red-600/30">
                        <p className="text-xs font-bold text-red-300 mb-1">⚠️ 最初に取ることはできません</p>
                        <p className="text-xs text-gray-300">
                            ゲーム開始時（リムービング）に赤コマを選ぶことはできません。
                        </p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded-lg border border-red-600/30">
                        <p className="text-xs font-bold text-red-300 mb-1">⚠️ 最後に取ると0点</p>
                        <p className="text-xs text-gray-300">
                            ゲーム終了時、最後の移動で赤コマを取得した場合、<strong className="text-red-400">スコアが0点</strong>になります。
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
                        <p className="text-xs font-bold text-gray-300 mb-1">💡 戦略ポイント</p>
                        <p className="text-xs text-gray-400">
                            赤コマ(10点)は得点が低いため、早めに取得するか、最後の一手として残さないよう注意が必要です。
                        </p>
                    </div>
                </div>
            </section>

            {/* Step 3: Ending and Retry */}
            <section>
                <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1 flex items-center gap-2">
                    <span className="text-blue-400">STEP 3</span>
                    ゲームの終了と再挑戦
                </h3>
                <div className="space-y-4">
                    <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-700">
                        <p className="text-sm mb-2"><strong className="text-gray-400">終了条件：</strong>移動できる手がなくなった時点で終了となります。</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                            <p className="text-xs font-bold text-blue-400 mb-1">次のプレイ</p>
                            <p className="text-[11px] text-gray-400">新しいランダムな配置でゲームを始めます。</p>
                        </div>
                        <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                            <p className="text-xs font-bold text-purple-400 mb-1">同じ盤でプレイ</p>
                            <p className="text-[11px] text-gray-400">今終わったゲームと全く同じ初期配置で再挑戦できます。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips and Credits */}
            <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-5 rounded-xl border border-blue-500/20">
                <h3 className="text-base font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <span>💡</span> ハイスコアのヒント
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-200 space-y-2">
                    <li><strong className="text-white">得点の高い色</strong>（白50点、青40点）を計画的に取得しましょう。</li>
                    <li>最初の1手（リムービング）でどこを消すかが、最終的な連鎖ルートを決めます。</li>
                    <li>行き詰まったら<strong className="text-purple-400">「同じ盤でプレイ」</strong>で違うルートを試してみるのが上達の近道です！</li>
                </ul>
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

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
            {/* Game Goal */}
            <section>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    ゲームの目標
                </h3>
                <p className="bg-gray-700/30 p-4 rounded-xl border border-gray-700">
                    ボード上のコマをジャンプで取っていき、<strong className="text-yellow-400">できるだけ高得点を目指す</strong>パズルゲームです。
                </p>
            </section>

            {/* Step 1: Preparation */}
            <section>
                <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ1：準備を理解する</h3>

                <div className="mb-4">
                    <h4 className="font-bold text-white text-sm mb-2">ボードの形と配置</h4>
                    <p className="text-sm text-gray-400 mb-2">
                        15箇所のスポットに、5色×3個＝<strong className="text-white">合計15個のコマ</strong>がランダムに配置されます。
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-white text-sm mb-2">コマの得点</h4>
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
                                    {PIECE_SCORES[item.key]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 2: Game Start */}
            <section>
                <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ2：ゲーム開始</h3>
                <div>
                    <h4 className="font-bold text-white text-sm mb-2">最初の1手</h4>
                    <p className="text-sm text-gray-400">
                        好きなコマを1つ選んでタップし、取り除きます。<br />
                        <span className="text-xs text-blue-400">※取り除いたコマの得点も加算されます</span>
                    </p>
                </div>
            </section>

            {/* Step 3: Taking Pieces */}
            <section>
                <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ3：コマを取っていく</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-white text-sm mb-1">基本ルール</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 pl-2">
                            <li>コマを選び、<strong className="text-white">直線上で1〜3個のコマを飛び越えて</strong>空きスポットに着地</li>
                            <li>飛び越えた<strong className="text-yellow-400">最後の1個のコマ</strong>を取得し、得点に加算</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm mb-1">移動できる方向</h4>
                        <div className="flex gap-2 text-xs">
                            <span className="bg-gray-700 px-2 py-1 rounded">水平方向(ー)</span>
                            <span className="bg-gray-700 px-2 py-1 rounded">左斜め(／)</span>
                            <span className="bg-gray-700 px-2 py-1 rounded">右斜め(＼)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 4: Game End */}
            <section>
                <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ4：ゲーム終了</h3>
                <p className="text-sm mb-2"><strong className="text-gray-400">終了条件：</strong>移動可能な手がなくなったら終了</p>
                <div className="bg-gray-700/30 p-3 rounded-lg">
                    <h4 className="text-xs font-bold text-gray-400 mb-1">ソロモードの目標</h4>
                    <ul className="list-disc list-inside text-sm text-gray-300 pl-1">
                        <li>できるだけ多くのコマを取る</li>
                        <li>できるだけ高得点を狙う</li>
                        <li>経過時間も表示されるのでタイムアタックも可能</li>
                    </ul>
                </div>
            </section>

            {/* Tips */}
            <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-xl border border-blue-500/20">
                <h3 className="text-base font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    <span>💡</span> 高得点のコツ
                </h3>
                <ol className="list-decimal list-inside text-sm text-gray-200 space-y-1">
                    <li><strong className="text-white">白（50点）や青（40点）</strong>を優先的に狙う</li>
                    <li>手詰まりにならないよう、先を読んで移動ルートを計画する</li>
                </ol>
            </section>

            <p className="text-center text-sm text-gray-400 italic pt-2">
                シンプルなルールながら、奥深い戦略性があるパズルです。<br />まずは気軽にプレイして、ベストスコアを目指してみてください！
            </p>
        </div>
    );
};

export default RulesContent;

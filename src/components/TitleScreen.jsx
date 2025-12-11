import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECE_SCORES } from '../constants/colors';

const TitleScreen = ({ onStart, onToggleAudio, isMuted }) => {
    const [showRules, setShowRules] = useState(false);
    const [showCPUMenu, setShowCPUMenu] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900 overflow-hidden">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12 text-center"
            >
                <img
                    src="/trypas-logo.png"
                    alt="TRYPAS"
                    className="w-[300px] md:w-[350px] mx-auto drop-shadow-2xl"
                />
                <p className="text-gray-400 mt-4 text-lg tracking-widest uppercase">
                    Strategic Board Game
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col gap-4 w-64"
            >
                <button
                    onClick={() => onStart('SOLO')}
                    className="group relative px-8 py-4 bg-white text-gray-900 font-bold text-xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg"
                >
                    <span className="relative z-10">SOLO PLAY</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>

                <button
                    disabled
                    className="px-8 py-3 bg-gray-800/50 text-gray-500 font-bold rounded-full border border-gray-700/50 cursor-not-allowed"
                >
                    VS CPU
                </button>

                <button
                    disabled
                    className="px-8 py-3 bg-gray-800/50 text-gray-500 font-bold rounded-full border border-gray-700/50 cursor-not-allowed"
                >
                    2 PLAYERS
                </button>

                <button
                    onClick={() => setShowRules(true)}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 hover:scale-105 transition-all"
                >
                    ルール説明
                </button>

                {/* Audio Toggle Button - Added to match Game Screen placement style (in the flow) */}
                <div className="flex justify-center mt-2">
                    <button
                        onClick={onToggleAudio}
                        className="w-[50px] h-[50px] flex items-center justify-center bg-gray-800 text-white rounded-full border border-gray-600 hover:bg-gray-700 transition-all shadow-lg"
                    >
                        <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
                    </button>
                </div>
            </motion.div>

            {/* Creator Credit */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-8 text-center"
            >
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Game Design: <span className="text-sm text-gray-400 font-semibold normal-case">Dr. Q</span>
                </p>
            </motion.div>

            {/* CPU Difficulty Menu */}
            <AnimatePresence>
                {showCPUMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCPUMenu(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-sm w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-white text-center">難易度選択</h2>

                            <div className="space-y-3">
                                <button
                                    onClick={() => { setShowCPUMenu(false); onStart('CPU_EASY'); }}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    EASY
                                </button>
                                <button
                                    onClick={() => { setShowCPUMenu(false); onStart('CPU_NORMAL'); }}
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    NORMAL
                                </button>
                                <button
                                    onClick={() => { setShowCPUMenu(false); onStart('CPU_HARD'); }}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    HARD
                                </button>
                            </div>

                            <button
                                onClick={() => setShowCPUMenu(false)}
                                className="mt-6 w-full py-2 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                            >
                                戻る
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rules Modal */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowRules(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                                <h2 className="text-2xl md:text-3xl font-black mb-6 text-white border-b border-gray-700 pb-4 flex items-center gap-3 flex-wrap">
                                    <div className="flex flex-col md:flex-row items-baseline gap-1 md:gap-3">
                                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-black tracking-wider">
                                            TRYPAS SOLOPLAY
                                        </span>
                                        <span className="text-lg md:text-xl text-gray-300 font-bold">
                                            の遊び方
                                        </span>
                                    </div>
                                </h2>

                                <div className="space-y-8 text-gray-300 leading-relaxed">

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

                                    {/* Step 1 */}
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
                                                <div className="grid grid-cols-5 text-center text-xs font-bold divide-x divide-gray-700 bg-gray-700/50 p-2">
                                                    <span className="text-red-400">赤</span>
                                                    <span className="text-yellow-400">黄</span>
                                                    <span className="text-[#2ECC71]">緑</span>
                                                    <span className="text-blue-400">青</span>
                                                    <span className="text-white">白</span>
                                                </div>
                                                <div className="grid grid-cols-5 text-center text-sm font-bold divide-x divide-gray-700 p-2 bg-gray-900/50">
                                                    <span className="text-red-400">10</span>
                                                    <span className="text-yellow-400">20</span>
                                                    <span className="text-[#2ECC71]">30</span>
                                                    <span className="text-blue-400">40</span>
                                                    <span className="text-white">50</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Step 2 */}
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

                                    {/* Step 3 */}
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
                            </div>

                            <button
                                onClick={() => setShowRules(false)}
                                className="mt-8 w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                            >
                                閉じる
                            </button>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                />
            </div>
        </div>
    );
};

export default TitleScreen;

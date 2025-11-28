import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECE_SCORES } from '../constants/colors';

const TitleScreen = ({ onStart }) => {
    const [showRules, setShowRules] = useState(false);
    const [showCPUMenu, setShowCPUMenu] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full absolute inset-0 bg-gray-900 z-50">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12 text-center"
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-2xl">
                    TRYPAS
                </h1>
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
                    onClick={() => onStart('LOCAL')}
                    className="group relative px-8 py-4 bg-white text-gray-900 font-bold text-xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10">2 PLAYERS</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>

                <button
                    onClick={() => onStart('SOLO')}
                    className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                    SOLO PLAY
                </button>

                <button
                    onClick={() => setShowCPUMenu(true)}
                    className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                    VS CPU
                </button>

                <button
                    onClick={() => setShowRules(true)}
                    className="px-8 py-3 bg-transparent text-gray-400 font-bold rounded-full border border-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    RULES
                </button>
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
                            className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-2">ルール</h2>

                            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                                <section>
                                    <h3 className="text-lg font-bold text-blue-400 mb-1">目的</h3>
                                    <p>駒を飛び越えて獲得します。最も高いスコアを獲得したプレイヤーが勝利します。</p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-blue-400 mb-1">移動</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>隣接する駒を飛び越えて、空いているスポットに移動します。</li>
                                        <li><strong>1～3個の連続した駒</strong>を一度に飛び越えることができます。</li>
                                        <li><strong>獲得できるのは、着地点の直前の駒1つのみ</strong>です。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-blue-400 mb-1">得点</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#F7FFF7]"></div> 白: {PIECE_SCORES.WHITE}点</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#45B7D1]"></div> 青: {PIECE_SCORES.BLUE}点</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#4ECDC4]"></div> 緑: {PIECE_SCORES.GREEN}点</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FFE66D]"></div> 黄: {PIECE_SCORES.YELLOW}点</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div> 赤: {PIECE_SCORES.RED}点</div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-red-400 mb-1">特別ルール</h3>
                                    <p><span className="text-red-400 font-bold">赤い駒</span>を獲得すると、<strong>もう一度手番</strong>が回ってきます！</p>
                                </section>
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

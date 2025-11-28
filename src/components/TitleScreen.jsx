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
                    onClick={() => setShowCPUMenu(true)}
                    className="group relative px-8 py-4 bg-white text-gray-900 font-bold text-xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10">VS CPU</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>

                <button
                    onClick={() => onStart('LOCAL')}
                    className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                    2 PLAYERS
                </button>

                <button
                    onClick={() => onStart('SOLO')}
                    className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                    SOLO PLAY
                </button>

                <button
                    onClick={() => setShowRules(true)}
                    className="px-8 py-3 bg-transparent text-gray-400 font-bold rounded-full border border-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    ルール説明
                </button>
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
                            className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-2">トライパスの説明</h2>

                            <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
                                <section className="bg-gray-700/30 p-4 rounded-lg">
                                    <p className="text-gray-200">
                                        トライパスは、遊びながら思考力、記憶力、創造力が鍛えられ、頭がよくなります。また1億以上の陣形がある驚くほど奥深いゲームですが、簡単に誰でもすぐにプレーできます。
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-blue-400 mb-3 border-l-4 border-blue-400 pl-3">トライパスの遊び方（二人対戦ゲーム）</h3>
                                    <ol className="space-y-2 pl-5">
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">①</span>
                                            <span>先手、後手を決め、後手が全コマの配置をします。<span className="text-gray-400">（陣形作り）</span></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">②</span>
                                            <span>先手はこれらのコマを盤面から1個取ります。</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">③</span>
                                            <span>後手は隣りのコマ2～3コマはトナメの交差点に連続に1コマだけ飛びこし、飛びこされたコマを盤面から取ります。</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">④</span>
                                            <span><strong className="text-red-400">赤コマをこえればトライパスで、続けてもう一度行います。</strong> ただし、<strong>最後の赤コマをこえると負けです。</strong></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">⑤</span>
                                            <span>コマをこえて飛ぶことができ、最後に取べない方負けです。</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">⑥</span>
                                            <span>その回の勝者は取ったコマの色に応じて得点します。その回の敗者は得点なしです。</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">⑦</span>
                                            <span>白ごとに、先手と後手が交互に入れかわります。</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="font-bold text-blue-300 shrink-0">⑧</span>
                                            <span>勝敗は規定得点の先取または勝数で競います。</span>
                                        </li>
                                    </ol>
                                    <div className="mt-3 text-xs text-gray-400 italic">
                                        規定得点は1000点、ハーフ戦は500点です。
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-yellow-400 mb-3 border-l-4 border-yellow-400 pl-3">コマの点数</h3>
                                    <div className="bg-gray-700/30 p-4 rounded-lg">
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-[#FF6B6B]"></div>
                                                <span className="font-bold">赤: {PIECE_SCORES.RED}点</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-[#FFE66D]"></div>
                                                <span className="font-bold">黄: {PIECE_SCORES.YELLOW}点</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-[#4ECDC4]"></div>
                                                <span className="font-bold">緑: {PIECE_SCORES.GREEN}点</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-[#45B7D1]"></div>
                                                <span className="font-bold">青: {PIECE_SCORES.BLUE}点</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-[#F7FFF7]"></div>
                                                <span className="font-bold">白: {PIECE_SCORES.WHITE}点</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 text-center">各色3個ずつ</p>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-purple-400 mb-3 border-l-4 border-purple-400 pl-3">詰めトライパスについて</h3>
                                    <p className="text-gray-200">
                                        終盤までの数手前から、終盤まで行ないます。詰めトライパスは1人で楽しめ、戦略研究に役立ちます。
                                    </p>
                                </section>

                                <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-blue-700/50">
                                    <h3 className="text-base font-bold text-blue-300 mb-2">💡 遊びながら頭脳トレーニング</h3>
                                    <ul className="space-y-1 text-xs">
                                        <li>✓ 開始陣形は<strong className="text-yellow-300">1億以上</strong>あります</li>
                                        <li>✓ 必ず<strong className="text-yellow-300">14手以内</strong>で勝負がつきます</li>
                                        <li>✓ 左脳パワー：論理力・判断力・記憶力</li>
                                        <li>✓ 右脳パワー：創造力・集中力・注意力</li>
                                    </ul>
                                </section>
                            </div>

                            <button
                                onClick={() => setShowRules(false)}
                                className="mt-8 w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                            >
                                閉じる
                            </button>
                            <button
                                onClick={() => { setShowRules(false); onStart('LOCAL'); }}
                                className="mt-3 w-full py-3 bg-gray-800 text-white font-bold rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors"
                            >
                                TITLE
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

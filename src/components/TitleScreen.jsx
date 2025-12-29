import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECE_SCORES } from '../constants/colors';
import RulesContent from './RulesContent';
import FeedbackModal from './FeedbackModal';
import packageJson from '../../package.json';

const TitleScreen = ({ onStart, onToggleAudio, isMuted }) => {
    const [showRules, setShowRules] = useState(false);
    const [showCPUMenu, setShowCPUMenu] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full bg-gray-900 overflow-hidden">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12 text-center"
            >
                <img
                    src="/trypas-logo-new.png"
                    alt="TRYPAS"
                    className="w-[300px] md:w-[350px] mx-auto drop-shadow-2xl"
                />
                <div className="mt-1 flex flex-col items-center gap-2">
                    <p className="text-gray-500 text-sm tracking-widest uppercase opacity-80">
                        Abstract Strategy game
                    </p>
                    <div className="flex items-center gap-3 px-5 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <span className="text-[10px] text-blue-300 tracking-[0.3em] font-bold uppercase">
                            Prototype
                        </span>
                        <div className="w-px h-3 bg-blue-400/30"></div>
                        <span className="text-[10px] text-blue-300/80 font-mono tracking-wider">
                            v{packageJson.version}
                        </span>
                    </div>
                </div>
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

                {/* Tutorial Button */}
                <button
                    onClick={() => onStart('TUTORIAL')}
                    className="group relative px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg border border-emerald-400/30"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="text-lg">📖</span>
                        TUTORIAL
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
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

            {/* Feedback Button (Fixed Bottom Right) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-4 right-4 z-50"
            >
                <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white/70 hover:text-white transition-all text-xs font-bold"
                >
                    📮 ご意見・ご要望
                </button>
            </motion.div>

            {/* Creator Credit & Version */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-8 text-center space-y-1"
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

                                {/* Unified Rules Content Component */}
                                <RulesContent />
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

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
            />

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

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
        <div className="relative flex flex-col items-center justify-center h-full w-full bg-gray-900 overflow-hidden px-2 py-2 sm:px-4 sm:py-4">
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto my-auto" style={{ gap: 'clamp(0.5rem, 2vh, 1.5rem)' }}>
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                    style={{ marginBottom: 'clamp(0.5rem, 2vh, 1.5rem)' }}
                >
                    <img
                        src="/trypas-logo-new.png"
                        alt="TRYPAS"
                        className="mx-auto drop-shadow-2xl"
                        style={{ width: 'clamp(180px, 50vw, 450px)' }}
                    />
                    <div className="mt-2 flex flex-col items-center gap-2">
                        <p className="text-gray-500 text-[10px] sm:text-sm tracking-widest uppercase opacity-80">
                            Abstract Strategy game
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1 sm:py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <span className="text-[9px] sm:text-[10px] text-blue-300 tracking-[0.3em] font-bold uppercase">
                                Prototype
                            </span>
                            <div className="w-px h-2.5 sm:h-3 bg-blue-400/30"></div>
                            <span className="text-[9px] sm:text-[10px] text-blue-300/80 font-mono tracking-wider">
                                v{packageJson.version}
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]"
                    style={{ gap: 'clamp(0.5rem, 1.5vh, 1rem)' }}
                >
                    <button
                        onClick={() => onStart('SOLO')}
                        className="group relative px-6 sm:px-10 py-3 sm:py-5 bg-white text-gray-900 font-bold text-lg sm:text-2xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        <span className="relative z-10">SOLO PLAY</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>

                    <button
                        onClick={() => onStart('TUTORIAL')}
                        className="group relative px-5 sm:px-10 py-2.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm sm:text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg border border-emerald-400/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <span className="text-base sm:text-lg">📖</span>
                            TUTORIAL
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>

                    <button
                        disabled
                        className="px-5 sm:px-10 py-2.5 sm:py-4 bg-gray-800/50 text-gray-500 font-bold text-sm sm:text-lg rounded-full border border-gray-700/50 cursor-not-allowed"
                    >
                        VS CPU
                    </button>

                    <button
                        disabled
                        className="px-5 sm:px-10 py-2.5 sm:py-4 bg-gray-800/50 text-gray-500 font-bold text-sm sm:text-lg rounded-full border border-gray-700/50 cursor-not-allowed"
                    >
                        2 PLAYERS
                    </button>

                    <button
                        onClick={() => setShowRules(true)}
                        className="px-5 sm:px-10 py-2.5 sm:py-4 bg-blue-600 text-white font-bold text-sm sm:text-lg rounded-full shadow-lg hover:bg-blue-500 hover:scale-105 transition-all"
                    >
                        ルール説明
                    </button>

                    <div className="flex justify-center mt-0.5 sm:mt-2">
                        <button
                            onClick={onToggleAudio}
                            className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] flex items-center justify-center bg-gray-800 text-white rounded-full border border-gray-600 hover:bg-gray-700 transition-all shadow-lg"
                        >
                            <span className="text-base sm:text-xl">{isMuted ? '🔇' : '🔊'}</span>
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-center space-y-0.5 sm:space-y-1"
                    style={{ marginTop: 'clamp(0.5rem, 1.5vh, 1.5rem)' }}
                >
                    <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                        Game Design: <span className="text-xs sm:text-sm text-gray-400 font-semibold normal-case">Dr. Q</span>
                    </p>
                </motion.div>
            </div>

            {/* Feedback Button (Fixed Bottom Right) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-4 right-4 z-50 pointer-events-auto"
            >
                <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white/70 hover:text-white transition-all text-[10px] sm:text-xs font-bold"
                >
                    📮 ご意見・ご要望
                </button>
            </motion.div>

            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
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

            {/* Rules Modal */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowRules(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <RulesContent />
                            <button
                                onClick={() => setShowRules(false)}
                                className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors"
                            >
                                閉じる
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback Modal */}
            <AnimatePresence>
                {showFeedback && (
                    <FeedbackModal onClose={() => setShowFeedback(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TitleScreen;

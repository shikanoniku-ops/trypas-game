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
        <div className="relative flex flex-col items-center justify-center min-h-full w-full bg-gray-900 overflow-y-auto overflow-x-hidden px-4 py-8 supports-[height:100dvh]:h-[100dvh]">
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto my-auto py-4">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 sm:mb-8 md:mb-12 text-center"
                >
                    <img
                        src="/trypas-logo-new.png"
                        alt="TRYPAS"
                        className="w-[180px] sm:w-[280px] md:w-[350px] mx-auto drop-shadow-2xl"
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
                    className="flex flex-col gap-3 sm:gap-4 w-56 sm:w-64"
                >
                    <button
                        onClick={() => onStart('SOLO')}
                        className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold text-lg sm:text-xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        <span className="relative z-10">SOLO PLAY</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>

                    {/* Tutorial Button */}
                    <button
                        onClick={() => onStart('TUTORIAL')}
                        className="group relative px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm sm:text-base rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg border border-emerald-400/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <span className="text-base sm:text-lg">📖</span>
                            TUTORIAL
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>

                    <button
                        disabled
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-800/50 text-gray-500 font-bold text-sm sm:text-base rounded-full border border-gray-700/50 cursor-not-allowed"
                    >
                        VS CPU
                    </button>

                    <button
                        disabled
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-800/50 text-gray-500 font-bold text-sm sm:text-base rounded-full border border-gray-700/50 cursor-not-allowed"
                    >
                        2 PLAYERS
                    </button>

                    <button
                        onClick={() => setShowRules(true)}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white font-bold text-sm sm:text-base rounded-full shadow-lg hover:bg-blue-500 hover:scale-105 transition-all"
                    >
                        ルール説明
                    </button>

                    {/* Audio Toggle Button - Added to match Game Screen placement style (in the flow) */}
                    <div className="flex justify-center mt-1 sm:mt-2">
                        <button
                            onClick={onToggleAudio}
                            className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] flex items-center justify-center bg-gray-800 text-white rounded-full border border-gray-600 hover:bg-gray-700 transition-all shadow-lg"
                        >
                            <span className="text-lg sm:text-xl">{isMuted ? '🔇' : '🔊'}</span>
                        </button>
                    </div>
                </motion.div>

                {/* Creator Credit & Version */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-6 sm:mt-8 text-center space-y-1"
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
        </div>
    );
};

export default TitleScreen;

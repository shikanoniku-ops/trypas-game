import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECE_SCORES } from '../constants/colors';
import RulesContent from './RulesContent';
import FeedbackModal from './FeedbackModal';
import packageJson from '../../package.json';

// Hexagon Background Pattern
const HexagonPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <polygon
                    points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-cyan-400"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
);

// Neural Network Lines
const NeuralLines = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                style={{
                    top: `${10 + i * 18}%`,
                    left: '-5%',
                    right: '-5%',
                }}
                animate={{
                    opacity: [0.1, 0.4, 0.1],
                    scaleX: [0.9, 1, 0.9],
                }}
                transition={{
                    duration: 4 + i * 0.8,
                    repeat: Infinity,
                    delay: i * 0.5,
                }}
            />
        ))}
    </div>
);

// Premium Neon Button Component
const NeonButton = ({ children, onClick, variant = "primary", delay = 0, size = "large" }) => {
    const variants = {
        primary: {
            bg: "from-cyan-500/10 via-cyan-600/15 to-blue-700/10",
            border: "border-cyan-400/50",
            glow: "shadow-[0_0_25px_rgba(0,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            hoverGlow: "hover:shadow-[0_0_40px_rgba(0,255,255,0.35),0_0_70px_rgba(0,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
            text: "text-cyan-200",
            accent: "from-cyan-400 to-blue-400"
        },
        secondary: {
            bg: "from-purple-500/10 via-purple-600/15 to-pink-700/10",
            border: "border-purple-400/50",
            glow: "shadow-[0_0_25px_rgba(168,85,247,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            hoverGlow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.35),0_0_70px_rgba(168,85,247,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
            text: "text-purple-200",
            accent: "from-purple-400 to-pink-400"
        },
        danger: {
            bg: "from-orange-500/10 via-red-600/15 to-red-700/10",
            border: "border-orange-400/50",
            glow: "shadow-[0_0_25px_rgba(255,150,50,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            hoverGlow: "hover:shadow-[0_0_40px_rgba(255,150,50,0.35),0_0_70px_rgba(255,150,50,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
            text: "text-orange-200",
            accent: "from-orange-400 to-red-400"
        },
        ghost: {
            bg: "from-gray-600/10 to-gray-700/10",
            border: "border-gray-500/30",
            glow: "shadow-[0_0_10px_rgba(100,100,100,0.1)]",
            hoverGlow: "hover:shadow-[0_0_20px_rgba(150,150,150,0.15)]",
            text: "text-gray-400",
            accent: "from-gray-400 to-gray-500"
        }
    };

    const style = variants[variant];
    const sizeClasses = size === "large" ? "py-5 sm:py-6 text-lg sm:text-xl" : "py-3.5 sm:py-4 text-base sm:text-lg";

    return (
        <motion.button
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ delay, duration: 0.45, type: "spring", stiffness: 150, damping: 18 }}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                group relative w-full px-6 sm:px-8 ${sizeClasses}
                bg-gradient-to-br ${style.bg}
                backdrop-blur-xl
                border ${style.border}
                rounded-xl
                ${style.glow} ${style.hoverGlow}
                transition-all duration-400
                overflow-hidden
            `}
        >
            {/* Animated background glow */}
            <motion.div
                className={`absolute inset-[-50%] bg-gradient-conic ${style.accent} opacity-0 group-hover:opacity-20`}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ filter: 'blur(30px)' }}
            />

            {/* Scan line effect */}
            <motion.div
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ top: '-5%', opacity: 0 }}
                animate={{ top: '105%', opacity: [0, 0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            />

            {/* Tech corners */}
            <div className="absolute top-0 left-0 w-5 h-5">
                <div className={`absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r ${style.accent}`} />
                <div className={`absolute top-0 left-0 w-[1.5px] h-full bg-gradient-to-b ${style.accent}`} />
            </div>
            <div className="absolute top-0 right-0 w-5 h-5">
                <div className={`absolute top-0 right-0 w-full h-[1.5px] bg-gradient-to-l ${style.accent}`} />
                <div className={`absolute top-0 right-0 w-[1.5px] h-full bg-gradient-to-b ${style.accent}`} />
            </div>
            <div className="absolute bottom-0 left-0 w-5 h-5">
                <div className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r ${style.accent}`} />
                <div className={`absolute bottom-0 left-0 w-[1.5px] h-full bg-gradient-to-t ${style.accent}`} />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5">
                <div className={`absolute bottom-0 right-0 w-full h-[1.5px] bg-gradient-to-l ${style.accent}`} />
                <div className={`absolute bottom-0 right-0 w-[1.5px] h-full bg-gradient-to-t ${style.accent}`} />
            </div>

            {/* Content */}
            <span className={`relative z-10 flex items-center justify-center gap-3 sm:gap-4 font-bold tracking-wide ${style.text}`}>
                {children}
            </span>
        </motion.button>
    );
};

// Section Header with glow
const SectionHeader = ({ icon, title, subtitle, color = "cyan" }) => {
    const colorStyles = {
        cyan: { text: "text-cyan-400", border: "border-cyan-400/30", bg: "bg-cyan-500/10", glow: "shadow-[0_0_20px_rgba(0,255,255,0.1)]" },
        orange: { text: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-500/10", glow: "shadow-[0_0_20px_rgba(255,150,50,0.1)]" },
        purple: { text: "text-purple-400", border: "border-purple-400/30", bg: "bg-purple-500/10", glow: "shadow-[0_0_20px_rgba(168,85,247,0.1)]" },
    };
    const style = colorStyles[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
        >
            <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${style.bg} border ${style.border} ${style.glow} backdrop-blur-sm mb-2`}>
                <span className="text-2xl sm:text-3xl">{icon}</span>
                <h2 className={`text-xl sm:text-2xl font-black ${style.text} tracking-wider`}>
                    {title}
                </h2>
            </div>
            <p className="text-gray-500 text-xs font-mono tracking-[0.2em] uppercase mt-1">
                {subtitle}
            </p>
        </motion.div>
    );
};

// Page Transition Animation
const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -80, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="w-full"
    >
        {children}
    </motion.div>
);

const TitleScreen = ({ onStart, onToggleAudio, isMuted }) => {
    const [showRules, setShowRules] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [menuState, setMenuState] = useState('main');

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
            {/* Layered Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#080810] to-gray-950" />

                {/* Hexagon pattern */}
                <HexagonPattern />

                {/* Neural network lines */}
                <NeuralLines />

                {/* Floating orbs */}
                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -25, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -35, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/12 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-500/8 rounded-full blur-[80px]"
                />

                {/* Scan lines overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        opacity: 0.03,
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)'
                    }}
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-4 h-full">
                <AnimatePresence mode="wait">
                    {/* ===== MAIN MENU ===== */}
                    {menuState === 'main' && (
                        <PageTransition key="main">
                            <div className="flex flex-col items-center gap-6 sm:gap-8">
                                {/* Logo Section */}
                                <motion.div
                                    initial={{ y: -50, opacity: 0, scale: 0.85 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7, type: "spring" }}
                                    className="text-center"
                                >
                                    <div className="relative">
                                        <img
                                            src={`${import.meta.env.BASE_URL}trypas-logo-new.png`}
                                            alt="TRYPAS"
                                            className="mx-auto"
                                            style={{
                                                width: 'clamp(200px, 55vw, 380px)',
                                                filter: 'drop-shadow(0 0 35px rgba(0,255,255,0.25))'
                                            }}
                                        />
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.5, duration: 0.7 }}
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"
                                        />
                                    </div>

                                    {/* Tagline */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-4 flex flex-col items-center gap-2.5"
                                    >
                                        <p className="text-cyan-400/40 text-[10px] sm:text-xs tracking-[0.35em] uppercase font-mono">
                                            Strategic Puzzle Game
                                        </p>
                                        <div className="flex items-center gap-2 sm:gap-3 px-4 py-1.5 bg-cyan-500/5 border border-cyan-400/20 rounded-full backdrop-blur-sm">
                                            <motion.div
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1.8, repeat: Infinity }}
                                                className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,255,255,0.8)]"
                                            />
                                            <span className="text-[9px] sm:text-[10px] text-cyan-400/80 tracking-[0.15em] font-semibold uppercase">
                                                Prototype
                                            </span>
                                            <div className="w-px h-2.5 bg-cyan-400/25" />
                                            <span className="text-[9px] sm:text-[10px] text-cyan-300/50 font-mono">
                                                v{packageJson.version}
                                            </span>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Menu Buttons */}
                                <div className="w-full max-w-[320px] sm:max-w-[360px] flex flex-col gap-3 sm:gap-4">
                                    <NeonButton onClick={() => setMenuState('vs')} variant="danger" delay={0.1}>
                                        <span className="text-2xl sm:text-3xl">🧠</span>
                                        VS MODE
                                    </NeonButton>

                                    <NeonButton onClick={() => setMenuState('solo')} variant="primary" delay={0.2}>
                                        <span className="text-2xl sm:text-3xl">🎯</span>
                                        SOLO PLAY
                                    </NeonButton>

                                    {/* Audio Button */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex justify-center mt-1"
                                    >
                                        <button
                                            onClick={onToggleAudio}
                                            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-900/40 rounded-full border border-cyan-400/20 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300 backdrop-blur-sm"
                                        >
                                            <span className="text-xl sm:text-2xl">{isMuted ? '🔇' : '🔊'}</span>
                                        </button>
                                    </motion.div>
                                </div>

                                {/* Credits */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-[10px] sm:text-xs text-gray-600 font-mono tracking-wider"
                                >
                                    GAME DESIGN: <span className="text-cyan-500/40">Dr. Q</span>
                                </motion.p>
                            </div>
                        </PageTransition>
                    )}

                    {/* ===== VS MODE SCREEN ===== */}
                    {menuState === 'vs' && (
                        <PageTransition key="vs">
                            <div className="flex flex-col items-center gap-5 w-full max-w-[340px]">
                                <SectionHeader
                                    icon="🧠"
                                    title="VS MODE"
                                    subtitle="Challenge Your Mind"
                                    color="orange"
                                />

                                <div className="w-full flex flex-col gap-4">
                                    {/* VS CPU */}
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500 font-mono tracking-wider px-1 flex items-center gap-2">
                                            <span className="text-base">🤖</span> VS CPU
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { level: 'EASY', border: 'border-green-400/60', bg: 'bg-green-500/10', text: 'text-green-400', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]', hoverShadow: 'hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]', mode: 'CPU_EASY' },
                                                { level: 'NORMAL', border: 'border-yellow-400/60', bg: 'bg-yellow-500/10', text: 'text-yellow-400', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]', hoverShadow: 'hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]', mode: 'CPU_NORMAL' },
                                                { level: 'HARD', border: 'border-red-400/60', bg: 'bg-red-500/10', text: 'text-red-400', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]', hoverShadow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]', mode: 'CPU_HARD' }
                                            ].map((item, i) => (
                                                <motion.button
                                                    key={item.level}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 + i * 0.08 }}
                                                    whileHover={{ scale: 1.05, y: -3 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => onStart(item.mode)}
                                                    className={`relative ${item.bg} ${item.text} font-bold text-xs sm:text-sm py-3.5 sm:py-4 rounded-lg border ${item.border} ${item.shadow} ${item.hoverShadow} backdrop-blur-sm transition-all duration-300 overflow-hidden`}
                                                >
                                                    {/* Tech corners */}
                                                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${item.border}`} />
                                                    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${item.border}`} />
                                                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${item.border}`} />
                                                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${item.border}`} />
                                                    {item.level}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 py-1">
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-700/50" />
                                        <span className="text-gray-600 text-[10px] font-mono tracking-widest">OR</span>
                                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-700/50" />
                                    </div>

                                    {/* 2 Players */}
                                    <NeonButton onClick={() => onStart('LOCAL')} variant="secondary" delay={0.25} size="medium">
                                        <span className="text-xl sm:text-2xl">👥</span>
                                        2 PLAYERS
                                    </NeonButton>

                                    {/* Back */}
                                    <NeonButton onClick={() => setMenuState('main')} variant="ghost" delay={0.3} size="medium">
                                        <span className="text-lg">←</span>
                                        BACK
                                    </NeonButton>
                                </div>
                            </div>
                        </PageTransition>
                    )}

                    {/* ===== SOLO PLAY SCREEN ===== */}
                    {menuState === 'solo' && (
                        <PageTransition key="solo">
                            <div className="flex flex-col items-center gap-5 w-full max-w-[340px]">
                                <SectionHeader
                                    icon="🎯"
                                    title="SOLO PLAY"
                                    subtitle="Train Your Mind"
                                    color="cyan"
                                />

                                <div className="w-full flex flex-col gap-3 sm:gap-4">
                                    <NeonButton onClick={() => onStart('SOLO')} variant="primary" delay={0.1}>
                                        <span className="text-2xl sm:text-3xl">▶️</span>
                                        START GAME
                                    </NeonButton>

                                    <NeonButton onClick={() => onStart('TUTORIAL')} variant="secondary" delay={0.2}>
                                        <span className="text-xl sm:text-2xl">📚</span>
                                        TUTORIAL
                                    </NeonButton>

                                    <NeonButton onClick={() => setMenuState('main')} variant="ghost" delay={0.3} size="medium">
                                        <span className="text-lg">←</span>
                                        BACK
                                    </NeonButton>
                                </div>
                            </div>
                        </PageTransition>
                    )}
                </AnimatePresence>
            </div>

            {/* Feedback Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-50"
            >
                <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-950/60 hover:bg-gray-900/80 backdrop-blur-md rounded-lg border border-gray-700/40 hover:border-cyan-400/30 text-gray-500 hover:text-cyan-400 transition-all duration-300 text-[10px] sm:text-xs font-mono"
                >
                    📮 FEEDBACK
                </button>
            </motion.div>

            {/* Rules Modal */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setShowRules(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                        >
                            <div className="bg-gray-950 p-6 sm:p-8 rounded-2xl border border-cyan-400/25 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(0,255,255,0.1)]" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-2xl sm:text-3xl font-black mb-5 text-cyan-400 border-b border-cyan-400/20 pb-4 tracking-wider">
                                    RULES
                                </h2>
                                <RulesContent pieceScores={PIECE_SCORES} />
                                <button
                                    onClick={() => setShowRules(false)}
                                    className="mt-6 w-full py-3.5 bg-cyan-500/10 text-cyan-400 font-bold rounded-xl border border-cyan-400/35 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
            />
        </div>
    );
};

export default TitleScreen;

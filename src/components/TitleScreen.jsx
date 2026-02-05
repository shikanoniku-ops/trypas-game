import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PIECE_SCORES } from '../constants/colors';
import RulesContentNew from './RulesContentNew';
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
                transition-all duration-100
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
        className="w-full flex flex-col items-center justify-center text-center"
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
                                    </div>

                                    {/* Tagline */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-4 flex flex-col items-center gap-2.5"
                                    >
                                        <p className="text-cyan-400/40 text-[10px] sm:text-xs tracking-[0.35em] uppercase font-mono">
                                            Abstract Strategy Game
                                        </p>

                                    </motion.div>
                                </motion.div>

                                {/* Menu Buttons */}
                                <div className="w-[90%] max-w-[360px] flex flex-col gap-3 sm:gap-4 mx-auto">
                                    <NeonButton onClick={() => setMenuState('vs')} variant="danger" delay={0.1}>
                                        VS MODE
                                    </NeonButton>

                                    <NeonButton onClick={() => setMenuState('solo')} variant="primary" delay={0.2}>
                                        SOLO PLAY
                                    </NeonButton>

                                    <NeonButton onClick={() => setShowRules(true)} variant="secondary" delay={0.3}>
                                        HOW TO PLAY
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
                                            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-900/40 rounded-full border border-cyan-400/20 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-100 backdrop-blur-sm"
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
                            <div className="flex flex-col items-center gap-6 w-[90%] max-w-[420px] mx-auto">
                                <SectionHeader
                                    icon=""
                                    title="VS MODE"
                                    subtitle="Challenge Your Mind"
                                    color="orange"
                                />

                                <div className="w-full flex flex-col gap-6">
                                    {/* VS CPU Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="h-2 w-2 bg-cyan-400 rotate-45 shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                                            <p className="text-lg sm:text-xl text-cyan-300 font-bold font-mono tracking-widest drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                                                VS CPU
                                            </p>
                                            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                {
                                                    level: 'EASY',
                                                    sub: 'Beginner',
                                                    border: 'border-green-400/60',
                                                    bg: 'bg-gradient-to-br from-green-500/10 via-green-500/5 to-green-900/20',
                                                    text: 'text-green-400',
                                                    shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]',
                                                    hoverShadow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]',
                                                    mode: 'CPU_EASY',
                                                    accent: 'from-green-400 to-emerald-400'
                                                },
                                                {
                                                    level: 'NORMAL',
                                                    sub: 'Standard',
                                                    border: 'border-yellow-400/60',
                                                    bg: 'bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-yellow-900/20',
                                                    text: 'text-yellow-400',
                                                    shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]',
                                                    hoverShadow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]',
                                                    mode: 'CPU_NORMAL',
                                                    accent: 'from-yellow-400 to-amber-400'
                                                },
                                                {
                                                    level: 'HARD',
                                                    sub: 'Expert',
                                                    border: 'border-red-400/60',
                                                    bg: 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-900/20',
                                                    text: 'text-red-400',
                                                    shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
                                                    hoverShadow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]',
                                                    mode: 'CPU_HARD',
                                                    accent: 'from-red-400 to-rose-400'
                                                }
                                            ].map((item, i) => (
                                                <motion.button
                                                    key={item.level}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.1 + i * 0.1 }}
                                                    whileHover={{ scale: 1.05, y: -4 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => onStart(item.mode)}
                                                    className={`
                                                        relative group h-20 sm:h-auto sm:aspect-square flex flex-col items-center justify-center gap-1
                                                        ${item.bg} ${item.border} border rounded-xl 
                                                        ${item.shadow} ${item.hoverShadow} 
                                                        backdrop-blur-md transition-all duration-200
                                                    `}
                                                >
                                                    {/* Internal Glow Effect */}
                                                    <div className={`absolute inset-0 bg-gradient-radial ${item.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                                    {/* Scanline Effect */}
                                                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] pointer-events-none" />

                                                    {/* Tech corners */}
                                                    <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${item.border}`} />
                                                    <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${item.border}`} />
                                                    <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${item.border}`} />
                                                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${item.border}`} />

                                                    <span className={`text-lg sm:text-xl font-black tracking-wider ${item.text} drop-shadow-md`}>
                                                        {item.level}
                                                    </span>
                                                    <span className={`text-[10px] sm:text-xs font-mono opacity-70 ${item.text} tracking-widest uppercase`}>
                                                        {item.sub}
                                                    </span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-4 py-2 opacity-60">
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
                                        <span className="text-gray-500 text-xs font-mono tracking-[0.3em]">VS</span>
                                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-500 to-transparent" />
                                    </div>

                                    {/* 2 Players */}
                                    <NeonButton onClick={() => onStart('LOCAL')} variant="secondary" delay={0.25} size="medium">
                                        2 PLAYERS
                                    </NeonButton>

                                    {/* Back */}
                                    <NeonButton onClick={() => setMenuState('main')} variant="ghost" delay={0.3} size="medium">
                                        BACK
                                    </NeonButton>
                                </div>
                            </div>
                        </PageTransition>
                    )}

                    {/* ===== SOLO PLAY SCREEN ===== */}
                    {menuState === 'solo' && (
                        <PageTransition key="solo">
                            <div className="flex flex-col items-center gap-5 w-[90%] max-w-[340px] mx-auto">
                                <SectionHeader
                                    icon=""
                                    title="SOLO PLAY"
                                    subtitle="Train Your Mind"
                                    color="cyan"
                                />

                                <div className="w-full flex flex-col gap-3 sm:gap-4">
                                    <NeonButton onClick={() => onStart('SOLO')} variant="primary" delay={0.1}>
                                        START GAME
                                    </NeonButton>

                                    <NeonButton onClick={() => onStart('TUTORIAL')} variant="secondary" delay={0.2}>
                                        TUTORIAL
                                    </NeonButton>

                                    <NeonButton onClick={() => setMenuState('main')} variant="ghost" delay={0.3} size="medium">
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
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-950/60 hover:bg-gray-900/80 backdrop-blur-md rounded-lg border border-gray-700/40 hover:border-cyan-400/30 text-gray-500 hover:text-cyan-400 transition-all duration-100 text-[10px] sm:text-xs font-mono"
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
                            className="w-full max-w-lg"
                        >
                            <div className="bg-gray-950 p-5 sm:p-8 rounded-2xl border border-cyan-400/25 w-full max-h-[85vh] overflow-y-auto shadow-[0_0_50px_rgba(0,255,255,0.1)] scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl sm:text-3xl font-black mb-4 text-cyan-400 border-b border-cyan-400/20 pb-3 tracking-wider">
                                    Official Rulebook
                                </h2>
                                <RulesContentNew />
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

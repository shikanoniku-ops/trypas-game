
// Premium Neon Button Component for Controls
const ControlNeonButton = ({ children, onClick, variant = "primary", isIcon = false }) => {
    const variants = {
        primary: {
            bg: "from-cyan-500/10 via-cyan-600/15 to-blue-700/10",
            border: "border-cyan-400/50",
            glow: "shadow-[0_0_15px_rgba(0,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            hoverGlow: "hover:shadow-[0_0_25px_rgba(0,255,255,0.35),0_0_40px_rgba(0,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
            text: "text-cyan-200 group-hover:text-cyan-100",
            accent: "from-cyan-400 to-blue-400"
        },
        secondary: {
            bg: "from-purple-500/10 via-purple-600/15 to-pink-700/10",
            border: "border-purple-400/50",
            glow: "shadow-[0_0_15px_rgba(168,85,247,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            hoverGlow: "hover:shadow-[0_0_25px_rgba(168,85,247,0.35),0_0_40px_rgba(168,85,247,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
            text: "text-purple-200 group-hover:text-purple-100",
            accent: "from-purple-400 to-pink-400"
        },
        danger: {
            bg: "from-orange-500/10 via-red-600/15 to-red-700/10",
            border: "border-orange-400/50",
            glow: "shadow-[0_0_15px_rgba(255,150,50,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            hoverGlow: "hover:shadow-[0_0_25px_rgba(255,150,50,0.35),0_0_40px_rgba(255,150,50,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]",
            text: "text-orange-200 group-hover:text-orange-100",
            accent: "from-orange-400 to-red-400"
        },
        gray: {
            bg: "from-gray-700/20 via-gray-800/30 to-gray-900/20",
            border: "border-gray-500/30",
            glow: "shadow-[0_0_10px_rgba(100,100,100,0.1)]",
            hoverGlow: "hover:shadow-[0_0_20px_rgba(150,150,150,0.15)]",
            text: "text-gray-400 group-hover:text-gray-200",
            accent: "from-gray-400 to-gray-500"
        }
    };

    const style = variants[variant] || variants.primary;

    return (
        <button
            onClick={onClick}
            className={`
                group relative w-full
                py-3 sm:py-3.5
                bg-gradient-to-br ${style.bg}
                backdrop-blur-xl
                border ${style.border}
                rounded-lg
                ${style.glow} ${style.hoverGlow}
                transition-all duration-200
                overflow-hidden
                active:scale-95
            `}
        >
            {/* Animated background glow */}
            <div
                className={`absolute inset-[-50%] bg-gradient-conic ${style.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                style={{ filter: 'blur(20px)' }}
            />

            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-2 h-2">
                <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r ${style.accent}`} />
                <div className={`absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b ${style.accent}`} />
            </div>
            <div className="absolute top-0 right-0 w-2 h-2">
                <div className={`absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l ${style.accent}`} />
                <div className={`absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b ${style.accent}`} />
            </div>
            <div className="absolute bottom-0 left-0 w-2 h-2">
                <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r ${style.accent}`} />
                <div className={`absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t ${style.accent}`} />
            </div>
            <div className="absolute bottom-0 right-0 w-2 h-2">
                <div className={`absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l ${style.accent}`} />
                <div className={`absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t ${style.accent}`} />
            </div>

            <span className={`relative z-10 font-bold tracking-wider ${style.text} flex items-center justify-center ${isIcon ? 'text-2xl' : 'text-sm sm:text-base font-mono'}`}>
                {children}
            </span>
        </button>
    );
};

export default ControlNeonButton;

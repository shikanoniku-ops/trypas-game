import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * チュートリアルガイドメッセージコンポーネント
 * プロフェッショナルなデザインでガイドを表示
 */
const TutorialGuide = ({
    stepData,
    currentStep,
    totalSteps,
    score,
    onAdvance,
    onExit,
    isComplete,
}) => {
    if (!stepData) return null;

    const isClickable = stepData.type === 'INTRO' || stepData.type === 'EXPLAIN' || stepData.type === 'COMPLETE';

    // ステップタイプに応じたスタイル
    const getStyle = () => {
        switch (stepData.type) {
            case 'INTRO':
                return {
                    bg: 'from-blue-600/95 to-purple-600/95',
                    border: 'border-blue-400/60',
                    icon: '🎮',
                    glow: 'shadow-blue-500/30',
                };
            case 'EXPLAIN':
                return {
                    bg: 'from-gray-700/95 to-gray-800/95',
                    border: 'border-gray-500/60',
                    icon: '📖',
                    glow: 'shadow-gray-500/20',
                };
            case 'REMOVE':
            case 'MOVE':
            case 'MOVE_TO':
                return {
                    bg: 'from-emerald-600/95 to-teal-700/95',
                    border: 'border-emerald-400/60',
                    icon: '👆',
                    glow: 'shadow-emerald-500/30',
                };
            case 'COMPLETE':
                return {
                    bg: 'from-yellow-500/95 to-orange-600/95',
                    border: 'border-yellow-400/60',
                    icon: '🎉',
                    glow: 'shadow-yellow-500/40',
                };
            default:
                return {
                    bg: 'from-gray-700/95 to-gray-800/95',
                    border: 'border-gray-500/60',
                    icon: '💡',
                    glow: 'shadow-gray-500/20',
                };
        }
    };

    const style = getStyle();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full max-w-md mx-auto"
            >
                <div
                    className={`
            relative overflow-hidden rounded-2xl
            bg-gradient-to-br ${style.bg}
            border-2 ${style.border}
            shadow-2xl ${style.glow}
            backdrop-blur-xl
            ${isClickable ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''}
          `}
                    onClick={isClickable ? onAdvance : undefined}
                >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
                        <motion.div
                            className="h-full bg-white/80"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Content */}
                    <div className="p-5 pt-6">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-3xl">{style.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                                        {stepData.type === 'COMPLETE' ? 'クリア！' : `Step ${currentStep + 1} / ${totalSteps}`}
                                    </span>
                                    {score > 0 && (
                                        <span className="text-sm font-black text-yellow-300">
                                            {score}点
                                        </span>
                                    )}
                                </div>

                                {/* Main Message */}
                                <p className="text-white font-bold text-base leading-relaxed whitespace-pre-line">
                                    {stepData.message}
                                </p>
                            </div>
                        </div>

                        {/* Sub Message */}
                        {stepData.subMessage && (
                            <div className="mt-3 pt-3 border-t border-white/20">
                                <p className="text-white/80 text-sm text-center font-medium">
                                    {isClickable && stepData.type !== 'COMPLETE' && '👆 '}
                                    {stepData.subMessage}
                                </p>
                            </div>
                        )}

                        {/* Complete Actions */}
                        {stepData.type === 'COMPLETE' && (
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAdvance();
                                    }}
                                    className="flex-1 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    もう一度プレイ
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onExit();
                                    }}
                                    className="flex-1 py-3 bg-gray-800/80 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors border border-white/20"
                                >
                                    タイトルへ
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pulse Effect for Action Steps */}
                    {(stepData.type === 'REMOVE' || stepData.type === 'MOVE' || stepData.type === 'MOVE_TO') && (
                        <motion.div
                            className="absolute inset-0 border-2 border-emerald-400 rounded-2xl pointer-events-none"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </div>

                {/* Exit Button (小さく控えめに) */}
                {!isComplete && stepData.type !== 'COMPLETE' && (
                    <div className="mt-3 text-center">
                        <button
                            onClick={onExit}
                            className="text-xs text-gray-400 hover:text-white transition-colors underline"
                        >
                            チュートリアルをスキップ
                        </button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default TutorialGuide;

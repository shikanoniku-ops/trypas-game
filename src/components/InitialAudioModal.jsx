import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InitialAudioModal = ({ onComplete, onEnableAudio }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const hasCheckedSettings = useRef(false);

    useEffect(() => {
        if (hasCheckedSettings.current) return;

        // Check localStorage specific key 'trypas_audio_settings'
        const savedSettings = localStorage.getItem('trypas_audio_settings');

        if (savedSettings) {
            const { skipPrompt, soundEnabled } = JSON.parse(savedSettings);
            if (skipPrompt) {
                hasCheckedSettings.current = true;
                // If skip prompt is set, automatically complete with saved preference
                // Note: Auto-play might rely on click/tap elsewhere if loaded from storage
                if (soundEnabled && onEnableAudio) onEnableAudio();
                onComplete(soundEnabled);
                return;
            }
        }

        // If no settings or skipPrompt is false, show the modal
        setIsVisible(true);
        hasCheckedSettings.current = true;
    }, [onComplete, onEnableAudio]);

    const handleSelection = (soundEnabled) => {
        if (dontShowAgain) {
            localStorage.setItem('trypas_audio_settings', JSON.stringify({
                skipPrompt: true,
                soundEnabled: soundEnabled
            }));
        }

        // Trigger audio unlock immediately within the click event
        if (soundEnabled && onEnableAudio) {
            onEnableAudio();
        }

        setIsVisible(false);
        // Add a small delay for exit animation before calling onComplete
        setTimeout(() => onComplete(soundEnabled), 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        <h2 className="text-2xl font-bold mb-6 text-white">
                            サウンド設定
                        </h2>

                        <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                            ゲームのBGMと効果音をオンにしますか？<br />
                            <span className="text-xs text-gray-500 mt-2 block">※後から設定画面で変更可能です</span>
                        </p>

                        <div className="flex flex-col gap-3 mb-6">
                            <button
                                onClick={() => handleSelection(true)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="text-xl group-hover:scale-125 transition-transform">🔊</span>
                                音楽をONにして始める
                            </button>

                            <button
                                onClick={() => handleSelection(false)}
                                className="w-full py-4 bg-gray-800 text-gray-400 font-bold rounded-xl border border-gray-700 hover:bg-gray-700 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">🔇</span>
                                音楽をOFFにして始める
                            </button>
                        </div>

                        {/* Don't show again checkbox */}
                        <div className="flex items-center justify-center gap-2">
                            <input
                                type="checkbox"
                                id="dontShowAgain"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500/50"
                            />
                            <label htmlFor="dontShowAgain" className="text-xs text-gray-400 cursor-pointer select-none">
                                次回から表示しない
                            </label>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InitialAudioModal;

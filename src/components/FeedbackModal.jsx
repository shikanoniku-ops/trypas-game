import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * フィードバックフォームモーダル
 * Formspreeを使用してメール送信を行う
 */
const FeedbackModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '不具合報告',
        message: ''
    });
    const [status, setStatus] = useState('IDLE'); // IDLE, SUBMITTING, SUCCESS, ERROR

    // FormspreeのフォームID (後でユーザーに設定してもらう)
    // https://formspree.io/ で取得したIDに入替えてください
    const FORMSPREE_ID = "mgvgparl";

    const handleSubmit = async (e) => {
        e.preventDefault();



        setStatus('SUBMITTING');

        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('SUCCESS');
                setFormData({ name: '', category: '不具合報告', message: '' });
                setTimeout(() => {
                    setStatus('IDLE');
                    onClose();
                }, 2000);
            } else {
                setStatus('ERROR');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            setStatus('ERROR');
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📮</span>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                フィードバック
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {status === 'SUCCESS' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-xl font-bold text-white mb-2">送信完了！</h3>
                            <p className="text-white/70">貴重なご意見ありがとうございます。</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Category Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white/70">種別</label>
                                <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
                                    {['不具合報告', '感想', 'その他'].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${formData.category === cat
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-white/50 hover:bg-white/10'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white/70">お名前 (任意)</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="ニックネームでもOK"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* Message Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white/70">内容</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="不具合の場合は、発生した状況なども教えていただけると助かります。"
                                    rows="5"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>

                            {/* Submit Custom Message */}
                            <div className="pt-2">
                                <p className="text-xs text-center text-white/40 mb-4">
                                    送信された内容は info@shokuba-lab へ送信されます
                                </p>
                                <button
                                    type="submit"
                                    disabled={status === 'SUBMITTING'}
                                    className={`
                                        w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                                        flex items-center justify-center gap-2
                                        ${status === 'SUBMITTING'
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-blue-500/25'
                                        }
                                    `}
                                >
                                    {status === 'SUBMITTING' ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            送信中...
                                        </>
                                    ) : (
                                        <>
                                            送信する <span className="text-xl">✈️</span>
                                        </>
                                    )}
                                </button>

                                {status === 'ERROR' && (
                                    <p className="text-red-400 text-sm text-center mt-3">
                                        送信に失敗しました。時間をおいて再試行してください。
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FeedbackModal;

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * クロスブラウザ対応のバックグラウンドミュージックフック
 * iOS Safari, Chrome, Firefox等での音声再生問題を解決
 */
export const useBackgroundMusic = (src, volume = 0.3) => {
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const wasPlayingRef = useRef(false);

    // AudioContextを作成（iOS Safari対策）
    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioContextRef.current = new AudioContext();
            }
        }
        return audioContextRef.current;
    }, []);

    // AudioContextを再開（ユーザー操作後に必要）
    const resumeAudioContext = useCallback(async () => {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            try {
                await ctx.resume();
                console.log('AudioContext resumed');
            } catch (e) {
                console.warn('AudioContext resume failed:', e);
            }
        }
    }, [getAudioContext]);

    // Audio要素の初期化
    useEffect(() => {
        if (!src) return;

        // 既存のaudio要素があれば再利用、なければ作成
        if (!audioRef.current) {
            const audio = new Audio();

            // クロスブラウザ互換性のための設定
            audio.preload = 'auto';
            audio.loop = true;
            audio.volume = volume;
            audio.playsInline = true; // iOS Safari対策

            // イベントリスナーで状態を同期
            audio.addEventListener('canplaythrough', () => {
                setIsReady(true);
            });

            audio.addEventListener('play', () => {
                setIsPlaying(true);
            });

            audio.addEventListener('pause', () => {
                // visibility changeによる一時停止は除外
                if (!document.hidden) {
                    setIsPlaying(false);
                }
            });

            audio.addEventListener('ended', () => {
                // ループ設定しているが念のため
                setIsPlaying(false);
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio error:', e.target?.error?.message || 'Unknown error');
                setIsPlaying(false);
                setIsReady(false);
            });

            // ソースを設定してロード開始
            audio.src = src;
            audio.load(); // 明示的にloadを呼ぶ（一部ブラウザで必要）

            audioRef.current = audio;
        } else {
            // srcが変わった場合のみ再設定
            if (audioRef.current.src !== src && src) {
                audioRef.current.src = src;
                audioRef.current.load();
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => { });
                audioContextRef.current = null;
            }
        };
    }, [src, volume]);

    // 音量の変更を反映
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const play = useCallback(async () => {
        if (!audioRef.current) {
            console.warn('Audio element not initialized');
            return false;
        }

        const attemptPlay = async () => {
            try {
                // AudioContextを再開（iOS Safari対策）
                await resumeAudioContext();

                // 既に再生中なら何もしない
                if (!audioRef.current.paused) {
                    setIsPlaying(true);
                    return true;
                }

                // 再生を試行
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    await playPromise;
                    setIsPlaying(true);
                    console.log('Audio playback started');
                    return true;
                }
                return true;
            } catch (error) {
                throw error;
            }
        };

        try {
            return await attemptPlay();
        } catch (error) {
            // NotAllowedError: ユーザー操作が必要
            if (error.name === 'NotAllowedError') {
                console.warn('Audio playback requires user interaction. Waiting for next user action...');

                const retryPlay = async () => {
                    try {
                        await attemptPlay();
                    } catch (e) {
                        console.warn('Retry play also failed:', e);
                    } finally {
                        document.removeEventListener('click', retryPlay);
                        document.removeEventListener('touchstart', retryPlay);
                    }
                };

                document.addEventListener('click', retryPlay, { once: true });
                document.addEventListener('touchstart', retryPlay, { once: true });

                // UI上は再生中として扱っておく（次回のタップで鳴るため）
                // ただし、完全に無音であることを示すためにfalseのままにする選択肢もあるが、
                // ユーザーが「ON」にしたという意図を汲んでtrueにするか、
                // あるいは「待機中」状態が必要。ここではシンプルにエラー扱いせずハンドリングする。
                // 今回は setIsPlaying(false) のままにしておき、実際に鳴ったときに true になるようにする。
                return false;
            } else if (error.name === 'AbortError') {
                // 再生が中断された（別のplay/pauseが呼ばれた）
                console.log('Audio playback was aborted');
            } else {
                console.error('Audio play error:', error.name, error.message);
            }
            setIsPlaying(false);
            return false;
        }
    }, [resumeAudioContext]);

    const pause = useCallback(() => {
        if (audioRef.current && !audioRef.current.paused) {
            try {
                audioRef.current.pause();
                setIsPlaying(false);
            } catch (error) {
                console.error('Audio pause error:', error);
            }
        }
    }, []);

    const toggleMute = useCallback(() => {
        if (audioRef.current) {
            const newMuted = !audioRef.current.muted;
            audioRef.current.muted = newMuted;
            setIsMuted(newMuted);
        }
    }, []);

    const setVolume = useCallback((newVolume) => {
        if (audioRef.current) {
            const clampedVolume = Math.max(0, Math.min(1, newVolume));
            audioRef.current.volume = clampedVolume;

            if (clampedVolume === 0) {
                audioRef.current.muted = true;
                setIsMuted(true);
            } else {
                audioRef.current.muted = false;
                setIsMuted(false);
            }
        }
    }, []);

    // Handle visibility change (pause when backgrounded, resume when focused)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!audioRef.current) return;

            if (document.hidden) {
                // バックグラウンドになったら一時停止
                wasPlayingRef.current = !audioRef.current.paused;
                if (wasPlayingRef.current) {
                    audioRef.current.pause();
                }
            } else {
                // フォアグラウンドに戻ったら再開
                if (wasPlayingRef.current && isPlaying) {
                    audioRef.current.play().catch(e => {
                        console.warn("Resume on visibility change failed:", e.message);
                    });
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isPlaying]);

    // ユーザー操作でAudioContextをアンロック（iOS Safari対策）
    useEffect(() => {
        const unlockAudio = async () => {
            await resumeAudioContext();
            // 一度だけ実行
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('touchend', unlockAudio);
            document.removeEventListener('click', unlockAudio);
        };

        document.addEventListener('touchstart', unlockAudio, { once: true });
        document.addEventListener('touchend', unlockAudio, { once: true });
        document.addEventListener('click', unlockAudio, { once: true });

        return () => {
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('touchend', unlockAudio);
            document.removeEventListener('click', unlockAudio);
        };
    }, [resumeAudioContext]);

    const reset = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }, []);

    return useMemo(() => ({
        play,
        pause,
        toggleMute,
        setVolume,
        reset,
        isPlaying,
        isMuted,
        isReady
    }), [play, pause, toggleMute, setVolume, reset, isPlaying, isMuted, isReady]);
};

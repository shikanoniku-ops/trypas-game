import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * クロスブラウザ対応のバックグラウンドミュージックフック
 * iOS Safari, Chrome, Firefox等での音声再生問題を解決
 */
export const useBackgroundMusic = (src, volume = 0.3) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const wasPlayingRef = useRef(false);

    // Audio要素の初期化
    useEffect(() => {
        if (!src) return;

        if (!audioRef.current) {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.loop = true;
            audio.volume = volume;
            // audio.playsInline = true; // new Audio()にはpropertyが存在しない場合があるが、念のため設定

            audio.addEventListener('canplaythrough', () => {
                setIsReady(true);
            });

            audio.addEventListener('play', () => {
                setIsPlaying(true);
            });

            audio.addEventListener('pause', () => {
                if (!document.hidden) {
                    setIsPlaying(false);
                }
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio error:', e.target?.error?.message);
                setIsPlaying(false);
                setIsReady(false);
            });

            audio.src = src;
            audio.load();
            audioRef.current = audio;
        } else {
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
        };
    }, [src]); // volumeは依存から外す（別で制御）

    // 音量の変更を反映
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const play = useCallback(() => {
        if (!audioRef.current) return false;

        // 非常にシンプルに play() だけを呼ぶ
        // これによりブラウザネイティブの自動再生ポリシー判定に委ねる
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsPlaying(true);
                    console.log('Audio playback started');
                })
                .catch(error => {
                    console.warn('Playback failed:', error);
                    // ユーザーインタラクションが必要なエラーの場合、
                    // ここで変なリトライ処理を入れず、次のクリックを待つのが最も安全
                    setIsPlaying(false);
                });
        }
        return true;
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggleMute = useCallback(() => {
        if (audioRef.current) {
            const newMuted = !audioRef.current.muted;
            audioRef.current.muted = newMuted;
            setIsMuted(newMuted);
        }
    }, []);

    const setAudioVolume = useCallback((newVolume) => {
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

    const reset = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }, []);

    // Visibility handling
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!audioRef.current) return;
            if (document.hidden) {
                if (!audioRef.current.paused) {
                    wasPlayingRef.current = true;
                    audioRef.current.pause();
                }
            } else {
                if (wasPlayingRef.current) {
                    audioRef.current.play().catch(e => console.warn('Resume failed', e));
                    wasPlayingRef.current = false;
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return useMemo(() => ({
        play,
        pause,
        toggleMute,
        setVolume: setAudioVolume,
        reset,
        isPlaying,
        isMuted,
        isReady
    }), [play, pause, toggleMute, setAudioVolume, reset, isPlaying, isMuted, isReady]);
};

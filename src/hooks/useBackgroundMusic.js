```javascript
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * ReactコンポーネントとしてのAudio要素を使用するフック
 * DOMに確実にマウントさせることでモバイル互換性を向上
 */
export const useBackgroundMusic = (src, volume = 0.3) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    
    // play/pause制御
    const play = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return false;

        // モバイルChrome対策: ユーザー操作時に必ずloadを呼んで準備させる
        // readyStateが低い場合、playだけだと失敗することがある
        if (audio.readyState < 2) { 
            audio.load();
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsPlaying(true);
                    console.log('Audio playback started');
                })
                .catch(error => {
                    console.warn('Playback failed:', error);
                    setIsPlaying(false);
                });
        }
        return true;
    }, []);

    const pause = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggleMute = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !audio.muted;
            setIsMuted(audio.muted);
        }
    }, []);

    const setVolume = useCallback((newVolume) => {
        const audio = audioRef.current;
        if (audio) {
            const clampedVolume = Math.max(0, Math.min(1, newVolume));
            audio.volume = clampedVolume;
            if (clampedVolume === 0) {
                audio.muted = true;
                setIsMuted(true);
            } else {
                audio.muted = false;
                setIsMuted(false);
            }
        }
    }, []);

    const reset = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }, []);

    // 初期設定とボリューム同期
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = isMuted ? 0 : volume;
            // 初期ミュート状態を同期
            setIsMuted(audio.muted);
            // 初期再生状態を同期
            setIsPlaying(!audio.paused);
        }
    }, [volume, isMuted]);

    // Visibility change handling
    useEffect(() => {
        const handleVisibilityChange = () => {
            const audio = audioRef.current;
            if (!audio) return;

            if (document.hidden) {
                if (!audio.paused) {
                    audio.pause();
                }
            } else {
                // 自動再開はユーザー体験を損なう場合があるが、
                // ゲームのBGMとしては戻ってきたら鳴るのが自然
                if (isPlaying) {
                    audio.play().catch(e => console.warn('Resume failed', e));
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isPlaying]);

    // Render用コンポーネント
    const AudioElement = useMemo(() => {
        return (
            <audio
                ref={audioRef}
                src={src}
                preload="auto"
                loop
                playsInline
                style={{ display: 'none' }}
            />
        );
    }, [src]);

    return {
        AudioElement,
        play,
        pause,
        toggleMute,
        setVolume,
        reset,
        isPlaying,
        isMuted
    };
};
```

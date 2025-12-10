import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

export const useBackgroundMusic = (src, volume = 0.3) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // Create audio element
        if (!audioRef.current && src) {
            audioRef.current = new Audio(src);
            audioRef.current.loop = true;
            audioRef.current.volume = volume;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [src, volume]);

    const play = useCallback(async () => {
        if (audioRef.current && !isPlaying) {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        }
    }, [isPlaying]);

    const pause = useCallback(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(prev => !prev);
        }
    }, []);

    const setVolume = useCallback((newVolume) => {
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            if (newVolume === 0) {
                setIsMuted(true);
            } else {
                setIsMuted(false);
            }
        }
    }, []);

    return useMemo(() => ({ play, pause, toggleMute, setVolume, isPlaying, isMuted }), [play, pause, toggleMute, setVolume, isPlaying, isMuted]);
};

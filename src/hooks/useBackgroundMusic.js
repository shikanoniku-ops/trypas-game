import { useEffect, useState, useMemo } from 'react';
import { audioManager } from '../utils/AudioManager';

/**
 * シングルトンAudioManagerを使用するReactフック
 * コンポーネントの再レンダリングに依存せず、安定した音声管理を提供します。
 */
export const useBackgroundMusic = (src, volume = 0.3) => {
    // AudioManagerの状態と同期するためのLocal State
    const [state, setState] = useState(audioManager.getState());

    // ソースの設定（初回マウント時または変更時）
    useEffect(() => {
        if (src) {
            audioManager.setSource(src);
        }
    }, [src]);

    // ボリュームの初期設定
    useEffect(() => {
        audioManager.setVolume(volume);
    }, [volume]);

    // 状態のサブスクライブ
    useEffect(() => {
        const unsubscribe = audioManager.subscribe((newState) => {
            setState(newState);
        });
        return unsubscribe;
    }, []);

    // APIのラッパー
    const controls = useMemo(() => ({
        play: () => audioManager.play(),
        pause: () => audioManager.pause(),
        toggleMute: () => audioManager.toggleMute(),
        setVolume: (v) => audioManager.setVolume(v),
        reset: () => audioManager.reset(),
        // 状態
        isPlaying: state.isPlaying,
        isMuted: state.isMuted,
        isReady: state.isReady,
        // 下位互換性のため AudioElement プロパティは null または空fragmentを返す
        // (App.jsxでレンダリングする必要がなくなったため)
        AudioElement: null
    }), [state]);

    return controls;
};

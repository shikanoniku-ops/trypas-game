/**
 * AudioManager.js
 * シングルトンパターンを利用してアプリケーション全体で唯一のAudioインスタンスを管理します。
 * モバイルブラウザ（特にAndroid ChromeやLINEブラウザ）での再生安定性を向上させます。
 */
class AudioManager {
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }

        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.loop = true;

        // 状態リスナー管理
        this.listeners = new Set();

        // Audioイベントのバインド
        this._bindEvents();

        AudioManager.instance = this;
    }

    _bindEvents() {
        this.audio.addEventListener('play', () => this._emitChange());
        this.audio.addEventListener('pause', () => this._emitChange());
        this.audio.addEventListener('ended', () => this._emitChange());
        this.audio.addEventListener('volumechange', () => this._emitChange());
        this.audio.addEventListener('error', (e) => {
            console.error('AudioManager Error:', e.target?.error);
            this._emitChange();
        });

        // Visibility Change対応
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (!this.audio.paused) {
                    this.wasPlaying = true;
                    this.audio.pause();
                }
            } else {
                if (this.wasPlaying) {
                    // ユーザーが戻ってきたら再開を試みる
                    this.play().catch(e => console.warn('Resume on visibility change failed', e));
                    this.wasPlaying = false;
                }
            }
        });
    }

    _emitChange() {
        this.listeners.forEach(callback => callback(this.getState()));
    }

    destroy() {
        // シングルトンなので通常破棄しないが、クリーンアップ用に
        this.audio.pause();
        this.audio.src = '';
        this.listeners.clear();
    }

    // --- Public API ---

    setSource(src) {
        if (this.audio.src !== src && src) {
            this.audio.src = src;
            this.audio.load();
        }
    }

    /**
     * 再生を実行します。
     * このメソッドは必ずユーザーインタラクション（クリックなど）のイベントハンドラ内から
     * 同期的に、または直近で呼び出される必要があります。
     */
    play() {
        // Android Chrome対策: readyStateが低い場合はloadを呼ぶ
        if (this.audio.readyState < 2) {
            this.audio.load();
        }
        return this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    setVolume(volume) {
        // volumeは0.0〜1.0
        const v = Math.max(0, Math.min(1, volume));
        this.audio.volume = v;
        if (v === 0) {
            this.audio.muted = true;
        } else {
            this.audio.muted = false;
        }
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        // ミュート解除時にボリュームが0なら戻す
        if (!this.audio.muted && this.audio.volume === 0) {
            this.audio.volume = 0.3; // デフォルト
        }
    }

    reset() {
        this.audio.currentTime = 0;
    }

    subscribe(callback) {
        this.listeners.add(callback);
        // 初期状態を通知
        callback(this.getState());
        return () => this.listeners.delete(callback);
    }

    getState() {
        return {
            isPlaying: !this.audio.paused,
            isMuted: this.audio.muted,
            volume: this.audio.volume,
            isReady: this.audio.readyState >= 3 // HAVE_FUTURE_DATA
        };
    }
}

// シングルトンインスタンスをエクスポート
export const audioManager = new AudioManager();

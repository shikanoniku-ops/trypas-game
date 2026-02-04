import React from 'react';
import { motion } from 'framer-motion';

/**
 * ゲーム終了時に表示されるモーダルコンポーネント（サイバーパンクスタイル）
 * スコア表示、リプレイ、次のゲームへの遷移などを提供
 */

// ネオンボタンコンポーネント
const CyberButton = ({ children, onClick, variant = "primary", icon = null }) => {
  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-cyan-500/20 to-purple-500/20",
      border: "border-cyan-400/50",
      text: "text-cyan-300",
      shadow: "shadow-[0_0_20px_rgba(0,255,255,0.2)]",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]",
      hoverBorder: "hover:border-cyan-400/80"
    },
    accent: {
      bg: "bg-gradient-to-r from-purple-500/30 to-pink-500/30",
      border: "border-purple-400/60",
      text: "text-white",
      shadow: "shadow-[0_0_25px_rgba(168,85,247,0.3)]",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]",
      hoverBorder: "hover:border-purple-400"
    },
    secondary: {
      bg: "bg-gray-900/60",
      border: "border-gray-600/50",
      text: "text-gray-300",
      shadow: "shadow-none",
      hoverShadow: "hover:shadow-[0_0_15px_rgba(100,100,100,0.2)]",
      hoverBorder: "hover:border-gray-500"
    },
    ghost: {
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-gray-500 hover:text-cyan-400",
      shadow: "shadow-none",
      hoverShadow: "",
      hoverBorder: ""
    }
  };

  const style = variants[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full py-3.5 rounded-lg font-bold tracking-wide
        ${style.bg} ${style.border} ${style.text}
        ${style.shadow} ${style.hoverShadow} ${style.hoverBorder}
        border backdrop-blur-sm transition-all duration-300
        flex items-center justify-center gap-2
        relative overflow-hidden
      `}
    >
      {/* Tech corners for primary/accent */}
      {(variant === 'primary' || variant === 'accent') && (
        <>
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${style.border}`} />
          <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${style.border}`} />
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${style.border}`} />
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${style.border}`} />
        </>
      )}
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
};

// スコアカードコンポーネント
const ScoreCard = ({ label, value, isWinner = false, color = "cyan" }) => {
  const colorStyles = {
    cyan: {
      border: isWinner ? "border-cyan-400/80" : "border-cyan-400/30",
      text: "text-cyan-400",
      shadow: isWinner ? "shadow-[0_0_25px_rgba(0,255,255,0.3)]" : "",
      bg: isWinner ? "bg-cyan-500/10" : "bg-gray-900/50"
    },
    red: {
      border: isWinner ? "border-red-400/80" : "border-red-400/30",
      text: "text-red-400",
      shadow: isWinner ? "shadow-[0_0_25px_rgba(255,100,100,0.3)]" : "",
      bg: isWinner ? "bg-red-500/10" : "bg-gray-900/50"
    },
    yellow: {
      border: "border-yellow-400/50",
      text: "text-yellow-400",
      shadow: "shadow-[0_0_20px_rgba(234,179,8,0.2)]",
      bg: "bg-yellow-500/10"
    }
  };

  const style = colorStyles[color];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        flex flex-col items-center px-6 py-4 rounded-lg
        ${style.bg} border ${style.border} ${style.shadow}
        backdrop-blur-sm min-w-[100px] relative
      `}
    >
      {/* Winner indicator */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs"
        >
          👑
        </motion.div>
      )}
      <span className={`${style.text} text-xs font-bold uppercase tracking-wider mb-1`}>
        {label}
      </span>
      <span className="text-3xl font-black text-white leading-none">
        {value}
      </span>
    </motion.div>
  );
};

function GameOverModal({
  phase,
  isReplaying,
  isBoardOverview,
  setIsBoardOverview,
  gameMode,
  scores,
  winner,
  elapsedTime,
  moveHistory,
  formatTime,
  resetGame,
  startReplay,
  handleBackToTitle,
  getGameHint
}) {
  // モーダルを表示しない条件
  if (phase !== 'GAME_OVER' || isReplaying) return null;

  const isSoloMode = gameMode === 'SOLO';
  const isCPUMode = gameMode.startsWith('CPU_');

  // 盤面確認モードの場合は何も表示しない
  if (isBoardOverview) {
    return null;
  }

  // メインのゲームオーバーモーダル
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/85 backdrop-blur-lg flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="bg-[#0a0a12] backdrop-blur-xl p-8 rounded-xl border border-cyan-400/20 max-w-sm w-full text-center relative overflow-hidden"
        style={{ boxShadow: '0 0 60px rgba(0,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(0,255,255,0.1), transparent, rgba(168,85,247,0.1))',
          pointerEvents: 'none'
        }} />

        {/* Tech corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-400/60 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400/60 rounded-br-xl" />

        {/* Scan line animation */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: '100%', opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Title */}
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 tracking-wider"
        >
          GAME OVER
        </motion.h2>

        {/* Results */}
        <div className="mb-6 relative z-10">
          {isSoloMode ? (
            <div className="flex flex-row items-center justify-center gap-4">
              {/* Score Card */}
              <ScoreCard label="SCORE" value={scores.p1} color="yellow" />

              {/* Time Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center px-6 py-4 rounded-lg bg-gray-900/50 border border-gray-600/30 backdrop-blur-sm min-w-[100px]"
              >
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                  TIME
                </span>
                <span className="text-2xl font-mono font-black text-white leading-none">
                  {formatTime(elapsedTime)}
                </span>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Time display */}
              {/* Time display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-baseline justify-center gap-3 mb-4"
              >
                <span className="text-gray-500 text-sm font-mono tracking-widest">TOTAL TIME</span>
                <span className="text-4xl font-black font-mono text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                  {formatTime(elapsedTime)}
                </span>
              </motion.div>

              {/* Winner announcement */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg"
              >
                <span className="text-gray-500">勝者: </span>
                <span className={`font-bold ${winner === 1 ? 'text-cyan-400' : 'text-red-400'}`}
                  style={{ textShadow: winner === 1 ? '0 0 10px rgba(0,255,255,0.5)' : '0 0 10px rgba(255,100,100,0.5)' }}
                >
                  {winner === 1 ? (isCPUMode ? 'YOU' : 'P1') : (isCPUMode ? 'CPU' : 'P2')}
                </span>
              </motion.div>

              {/* Score cards */}
              <div className="flex justify-center gap-4 mt-4">
                <ScoreCard
                  label={isCPUMode ? "YOU" : "P1"}
                  value={scores.p1}
                  color="cyan"
                  isWinner={winner === 1}
                />
                <ScoreCard
                  label={isCPUMode ? 'CPU' : 'P2'}
                  value={scores.p2}
                  color="red"
                  isWinner={winner === 2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 relative z-10">
          {/* 盤面確認ボタン - ソロモードのみ表示 */}
          {isSoloMode && (
            <CyberButton
              onClick={() => setIsBoardOverview(true)}
              variant="primary"
              icon="🔍"
            >
              盤面を確認する
            </CyberButton>
          )}

          <CyberButton
            onClick={() => resetGame()}
            variant="accent"
          >
            次のプレイ
          </CyberButton>

          <CyberButton
            onClick={() => resetGame(true)}
            variant="secondary"
          >
            同じ盤でプレイ
          </CyberButton>

          {moveHistory && moveHistory.length > 0 && (
            <CyberButton
              onClick={startReplay}
              variant="secondary"
            >
              リプレイを見る
            </CyberButton>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-1" />

          <CyberButton
            onClick={() => { resetGame(); handleBackToTitle(); }}
            variant="ghost"
          >
            タイトルへ戻る
          </CyberButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GameOverModal;

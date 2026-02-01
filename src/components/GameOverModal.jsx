import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * ゲーム終了時に表示されるモーダルコンポーネント
 * スコア表示、リプレイ、次のゲームへの遷移などを提供
 */
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

  // 盤面確認モードの場合は何も表示しない（App.jsx側で表示を制御）
  if (isBoardOverview) {
    return null;
  }

  // メインのゲームオーバーモーダル
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-[#1a1a2e] backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
      >
        {/* トップグラデーションライン */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

        {/* タイトル */}
        <h2 className="text-2xl font-bold text-white mb-6 mt-2">
          ゲーム終了
        </h2>

        {/* 結果表示 */}
        <div className="mb-6 text-gray-300">
          {isSoloMode ? (
            <div className="flex flex-row items-center justify-center gap-4">
              {/* スコアカード */}
              <div className="flex flex-col items-center bg-black/20 p-4 rounded-2xl border border-white/10 min-w-[130px]">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-bold">Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-yellow-400 leading-none drop-shadow-md">
                    {scores.p1}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">PTS</span>
                </div>
              </div>

              {/* タイムカード */}
              <div className="flex flex-col items-center bg-black/20 p-4 rounded-2xl border border-white/10 min-w-[130px]">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-bold">Time</span>
                <span className="text-2xl font-mono font-black text-white shadow-purple-500/50 drop-shadow-sm leading-none">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 対戦モードの時間表示 */}
              <div className="text-center mb-1">
                <span className="text-gray-500 text-xs mr-2 uppercase tracking-wider">Total Time</span>
                <span className="font-mono font-bold text-white">{formatTime(elapsedTime)}</span>
              </div>

              <div className="text-lg text-white">
                <span className="text-gray-400">勝者: </span>
                <span className={winner === 1 ? 'text-blue-400' : 'text-rose-400'}>
                  {winner === 1 ? 'プレイヤー1' : (isCPUMode ? 'CPU' : 'プレイヤー2')}
                </span>
              </div>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center bg-gray-800/50 px-6 py-3 rounded-xl min-w-[80px]">
                  <span className="text-blue-400 font-medium text-sm">P1</span>
                  <span className="text-2xl font-bold text-white">{scores.p1}</span>
                </div>
                <div className="flex flex-col items-center bg-gray-800/50 px-6 py-3 rounded-xl min-w-[80px]">
                  <span className="text-rose-400 font-medium text-sm">{isCPUMode ? 'CPU' : 'P2'}</span>
                  <span className="text-2xl font-bold text-white">{scores.p2}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ボタン群 */}
        <div className="flex flex-col gap-3">
          {/* 盤面確認ボタン */}
          <button
            onClick={() => setIsBoardOverview(true)}
            className="w-full py-3 bg-gray-600/50 hover:bg-gray-500/50 text-white font-medium rounded-lg border border-gray-500/30 transition-all flex items-center justify-center gap-2 mb-1 group"
          >
            <span className="group-hover:scale-110 transition-transform">🔍</span>
            盤面を確認する
          </button>
          <button
            onClick={() => resetGame()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold rounded-lg transition-all"
          >
            次のプレイ
          </button>
          <button
            onClick={() => resetGame(true)}
            className="w-full py-3 bg-gray-700/80 hover:bg-gray-600 text-white font-medium rounded-lg border border-gray-600/50 transition-all"
          >
            同じ盤でプレイ
          </button>
          {moveHistory && moveHistory.length > 0 && (
            <button
              onClick={startReplay}
              className="w-full py-3 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg border border-gray-600/50 transition-all"
            >
              リプレイを見る
            </button>
          )}
          <div className="border-t border-gray-700/50 my-1" />
          <button
            onClick={() => { resetGame(); handleBackToTitle(); }}
            className="w-full py-3 text-gray-400 hover:text-white font-medium transition-all"
          >
            タイトルへ戻る
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GameOverModal;

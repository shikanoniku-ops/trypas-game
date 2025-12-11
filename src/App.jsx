import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameLogic } from './hooks/useGameLogic';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import TitleScreen from './components/TitleScreen';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import InitialAudioModal from './components/InitialAudioModal';
import { PIECE_SCORES, PIECE_COLORS } from './constants/colors';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('LOCAL');
  const [showRulesInGame, setShowRulesInGame] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Background Music
  const titleBGM = useBackgroundMusic('/sounds/TRYPAS_Theme.mp3', 0.3);
  const gameBGM = useBackgroundMusic('/sounds/TRYPAS_Theme.mp3', 0.3);

  // Music control based on game state
  // Music control based on game state
  useEffect(() => {
    if (!audioInitialized) return;

    if (gameStarted) {
      titleBGM.pause();
      gameBGM.play();
    } else {
      gameBGM.pause();
      titleBGM.play();
    }
  }, [gameStarted, audioInitialized]);

  const handleAudioSetup = (soundEnabled) => {
    if (soundEnabled) {
      setIsMuted(false);
      titleBGM.setVolume(0.3);
      gameBGM.setVolume(0.3);
      // Play appropriate music
      if (gameStarted) {
        gameBGM.play();
      } else {
        titleBGM.play();
      }
    } else {
      setIsMuted(true);
      titleBGM.setVolume(0);
      gameBGM.setVolume(0);
    }
    setAudioInitialized(true);
  };

  const {
    board,
    turn,
    scores,
    phase,
    selectedSpot,
    validMoves,
    winner,
    lastActionMessage,
    handleSpotClick,
    resetGame,
    elapsedTime,
    turnTime,
    totalThinkingTime,
    capturedPieces,
    moveHistory,
    isReplaying,
    replayStep,
    startReplay,
    stopReplay,
    nextReplayStep,
    prevReplayStep,
    jumpToReplayStep
  } = useGameLogic(gameMode);

  const handleStartGame = (mode) => {
    setGameMode(mode);
    resetGame();
    setGameStarted(true);
  };

  const handleBackToTitle = () => {
    setGameStarted(false);
  };

  const isCPUMode = gameMode.startsWith('CPU_');
  const isSoloMode = gameMode === 'SOLO';

  const currentBGM = gameStarted ? gameBGM : titleBGM;

  const toggleAudio = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    const newVolume = newMutedState ? 0 : 0.3;
    titleBGM.setVolume(newVolume);
    gameBGM.setVolume(newVolume);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center">
      {/* Music Control Button and Menu */}
      <InitialAudioModal onComplete={handleAudioSetup} />

      {/* Music Control Button */}
      <div className="fixed top-4 right-4 z-[9999]">
        <button
          onClick={toggleAudio}
          className="w-12 h-12 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm rounded-full border border-gray-600 transition-all hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
          title={isMuted ? "ミュート解除" : "ミュート"}
        >
          <span className="text-2xl">{isMuted ? '🔇' : '🔊'}</span>
        </button>
      </div>

      <div className="relative w-full max-w-4xl flex-grow flex flex-col items-center justify-center p-4">

        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <TitleScreen onStart={handleStartGame} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center justify-center"
            >
              {/* Game Header - Redesigned for Mobile */}
              <div className="flex-shrink-0 w-full max-w-[95%] mb-2">
                <div className="flex flex-row items-center justify-between gap-4">
                  {/* Left Side: Logo & Status */}
                  <div className="flex flex-col items-start gap-2">
                    <img
                      src="/trypas-logo.png"
                      alt="TRYPAS"
                      className="w-[120px] opacity-90 drop-shadow-lg"
                    />

                    {/* Status Pill moved from ScoreBoard */}
                    <div className="relative group">
                      <div
                        className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-full border border-gray-700/50"
                        style={{
                          borderColor: phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.3)' : (turn === 1 ? 'rgba(96, 165, 250, 0.3)' : 'rgba(251, 113, 133, 0.3)'),
                          boxShadow: `0 0 10px ${phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.1)' : (turn === 1 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(251, 113, 133, 0.1)')}`
                        }}
                      />
                      <div className="relative px-4 py-1 flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${phase === 'REMOVING' ? 'bg-yellow-400 animate-pulse' : (turn === 1 ? 'bg-blue-400' : 'bg-rose-400')}`}
                        />
                        <span
                          className={`text-[10px] font-bold tracking-widest uppercase ${phase === 'REMOVING' ? 'text-yellow-400' : (isSoloMode || turn === 1 ? 'text-blue-400' : 'text-rose-400')}`}
                        >
                          {phase === 'REMOVING' ? 'セットアップ' : (isReplaying ? 'リプレイ' : (isSoloMode ? 'SOLO PLAY' : (turn === 1 ? 'P1 ターン' : (isCPUMode ? 'CPU ターン' : 'P2 ターン'))))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: ScoreBoard (Compact) */}
                  <div className="flex-grow flex justify-end">
                    <ScoreBoard
                      scores={scores}
                      turn={turn}
                      phase={phase}
                      lastActionMessage={lastActionMessage}
                      gameMode={gameMode}
                      totalThinkingTime={totalThinkingTime}
                      capturedPieces={capturedPieces}
                      isReplaying={isReplaying}
                      compactMode={true} // New prop for compact layout
                    />
                  </div>
                </div>
              </div>

              {/* Game Board */}
              <div className="flex items-center justify-center w-full my-1 md:my-4 scale-95 md:scale-100 origin-center">
                <GameBoard
                  board={board}
                  onSpotClick={handleSpotClick}
                  selectedSpot={selectedSpot}
                  validMoves={validMoves}
                />
              </div>

              {/* Timer Display - Compact */}
              {!isReplaying && (
                <div className="mb-2 text-center pointer-events-none">
                  <div className="text-xl font-bold font-mono tracking-widest bg-gray-900/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-gray-700/30">
                    {isSoloMode ? (
                      <span className="text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">
                        {phase === 'REMOVING' ? '00:00' : `${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}`}
                      </span>
                    ) : (
                      <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
                        {phase === 'REMOVING' ? '00:00' : `${Math.floor(turnTime / 60).toString().padStart(2, '0')}:${(turnTime % 60).toString().padStart(2, '0')}`}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Score Legend (below Timer) */}
              <div className="mb-2 p-2 bg-gray-800/50 rounded-xl border border-gray-700 max-w-md mx-4">
                <div className="flex gap-4 justify-center items-center flex-wrap text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIECE_COLORS.RED }}></div>
                    <span className="text-gray-300">{PIECE_SCORES.RED}点</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIECE_COLORS.YELLOW }}></div>
                    <span className="text-gray-300">{PIECE_SCORES.YELLOW}点</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIECE_COLORS.GREEN }}></div>
                    <span className="text-gray-300">{PIECE_SCORES.GREEN}点</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIECE_COLORS.BLUE }}></div>
                    <span className="text-gray-300">{PIECE_SCORES.BLUE}点</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIECE_COLORS.WHITE }}></div>
                    <span className="text-gray-300">{PIECE_SCORES.WHITE}点</span>
                  </div>
                </div>
              </div>

              {/* Winner Overlay Modal - Full Screen */}
              <AnimatePresence>
                {winner && !isReplaying && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="text-center relative z-10">
                        <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                          {winner === 'SOLO' ? 'GAME OVER' :
                            `${winner === 1 ? 'PLAYER 1' : (isCPUMode ? 'CPU' : 'PLAYER 2')} WINS!`}
                        </h2>

                        <div className="my-6">
                          <span className="text-gray-400 text-sm uppercase tracking-widest block mb-1">Final Score</span>
                          <p className="text-3xl font-mono font-bold text-white">
                            {isSoloMode ? `${scores.p1} PTS` : `${scores.p1} - ${scores.p2}`}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          {moveHistory.length > 0 && (
                            <button
                              onClick={startReplay}
                              className="w-full py-3 bg-gray-800 text-gray-300 font-bold rounded-xl border border-gray-700 hover:bg-gray-700 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                              <span>📽️</span> リプレイを見る
                            </button>
                          )}
                          <button
                            onClick={() => resetGame(false)}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all"
                          >
                            ネクストプレイ
                          </button>
                          <button
                            onClick={() => resetGame(true)}
                            className="w-full py-3 bg-gray-700 text-white font-bold rounded-xl border border-gray-600 hover:bg-gray-600 transition-all"
                          >
                            同じ盤でプレイ
                          </button>
                          <button
                            onClick={handleBackToTitle}
                            className="w-full py-3 bg-transparent text-gray-500 font-bold rounded-xl hover:bg-gray-800 hover:text-gray-300 transition-all"
                          >
                            タイトルへ戻る
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Replay Controls (below GameBoard) */}
              <AnimatePresence>
                {isReplaying && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="mb-1 p-2 bg-gray-800 rounded-2xl border-2 border-purple-500 max-w-md mx-4"
                  >
                    <div className="text-center mb-1">
                      <span className="text-white text-sm font-bold">
                        手順 {replayStep + 1} / {moveHistory.length}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={prevReplayStep}
                        disabled={replayStep === 0}
                        className="px-3 py-1.5 bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ⏮️ 前へ
                      </button>
                      <button
                        onClick={stopReplay}
                        className="px-4 py-1.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-500 transition-colors"
                      >
                        ⏹️ 終了
                      </button>
                      <button
                        onClick={nextReplayStep}
                        disabled={replayStep >= moveHistory.length - 1}
                        className="px-3 py-1.5 bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        次へ ⏭️
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Footer / Controls */}
              <div className="mt-2 flex gap-3">
                <button
                  onClick={handleBackToTitle}
                  className="px-6 py-2 bg-gray-800 text-white text-sm font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  TITLE
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-gray-800 text-white text-sm font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  RESET
                </button>
                <button
                  onClick={() => setShowRulesInGame(true)}
                  className="px-6 py-2 bg-gray-800 text-white text-sm font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  ルール
                </button>
              </div>

              {/* Rules Modal During Gameplay */}
              <AnimatePresence>
                {showRulesInGame && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowRulesInGame(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                      onClick={e => e.stopPropagation()}
                    >
                      <h2 className="text-2xl md:text-3xl font-black mb-6 text-white border-b border-gray-700 pb-4 flex items-center gap-3 flex-wrap">
                        <div className="flex flex-col md:flex-row items-baseline gap-1 md:gap-3">
                          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-black tracking-wider">
                            TRYPAS SOLOPLAY
                          </span>
                          <span className="text-lg md:text-xl text-gray-300 font-bold">
                            の遊び方
                          </span>
                        </div>
                      </h2>

                      <div className="space-y-8 text-gray-300 leading-relaxed text-sm">

                        {/* Game Goal */}
                        <section>
                          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            ゲームの目標
                          </h3>
                          <p className="bg-gray-700/30 p-4 rounded-xl border border-gray-700">
                            ボード上のコマをジャンプで取っていき、<strong className="text-yellow-400">できるだけ高得点を目指す</strong>パズルゲームです。
                          </p>
                        </section>

                        {/* Step 1 */}
                        <section>
                          <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ1：準備を理解する</h3>

                          <div className="mb-4">
                            <h4 className="font-bold text-white text-sm mb-2">ボードの形と配置</h4>
                            <p className="text-sm text-gray-400 mb-2">
                              15箇所のスポットに、5色×3個＝<strong className="text-white">合計15個のコマ</strong>がランダムに配置されます。
                            </p>
                          </div>

                          <div>
                            <h4 className="font-bold text-white text-sm mb-2">コマの得点</h4>
                            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-600">
                              <div className="grid grid-cols-5 text-center text-xs font-bold divide-x divide-gray-700 bg-gray-700/50 p-2">
                                <span className="text-red-400">赤</span>
                                <span className="text-yellow-400">黄</span>
                                <span className="text-green-400">緑</span>
                                <span className="text-blue-400">青</span>
                                <span className="text-white">白</span>
                              </div>
                              <div className="grid grid-cols-5 text-center text-sm font-bold divide-x divide-gray-700 p-2 bg-gray-900/50">
                                <span className="text-red-400">10</span>
                                <span className="text-yellow-400">20</span>
                                <span className="text-green-400">30</span>
                                <span className="text-blue-400">40</span>
                                <span className="text-white">50</span>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Step 2 */}
                        <section>
                          <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ2：ゲーム開始</h3>
                          <div className="flex items-start gap-3 bg-gray-700/20 p-3 rounded-lg">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">最初の1手</span>
                            <p className="text-sm">好きなコマを1つ選んで取り除く（この得点も加算されます）→ ゲームフェーズへ</p>
                          </div>
                        </section>

                        {/* Step 3 */}
                        <section>
                          <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ3：コマを取っていく</h3>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-white text-sm mb-1">基本ルール</h4>
                              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 pl-2">
                                <li>コマを選び、<strong className="text-white">直線上で1〜3個のコマを飛び越えて</strong>空きスポットに着地</li>
                                <li>飛び越えた<strong className="text-yellow-400">最後の1個のコマ</strong>を取得し、得点に加算</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm mb-1">移動できる方向</h4>
                              <div className="flex gap-2 text-xs">
                                <span className="bg-gray-700 px-2 py-1 rounded">水平方向(ー)</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">左斜め(／)</span>
                                <span className="bg-gray-700 px-2 py-1 rounded">右斜め(＼)</span>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Step 4: Game End */}
                        <section>
                          <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-gray-700 pb-1">ステップ4：ゲーム終了</h3>
                          <p className="text-sm mb-2"><strong className="text-gray-400">終了条件：</strong>移動可能な手がなくなったら終了</p>
                          <div className="bg-gray-700/30 p-3 rounded-lg">
                            <h4 className="text-xs font-bold text-gray-400 mb-1">ソロモードの目標</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300 pl-1">
                              <li>できるだけ多くのコマを取る</li>
                              <li>できるだけ高得点を狙う</li>
                              <li>経過時間も表示されるのでタイムアタックも可能</li>
                            </ul>
                          </div>
                        </section>

                        {/* Tips */}
                        <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-xl border border-blue-500/20">
                          <h3 className="text-base font-bold text-yellow-400 mb-2 flex items-center gap-2">
                            <span>💡</span> 高得点のコツ
                          </h3>
                          <ol className="list-decimal list-inside text-sm text-gray-200 space-y-1">
                            <li><strong className="text-white">白（50点）や青（40点）</strong>を優先的に狙う</li>
                            <li>手詰まりにならないよう、先を読んで移動ルートを計画する</li>
                          </ol>
                        </section>

                        <p className="text-center text-sm text-gray-400 italic pt-2">
                          シンプルなルールながら、奥深い戦略性があるパズルです。<br />まずは気軽にプレイして、ベストスコアを目指してみてください！
                        </p>
                      </div>

                      <button
                        onClick={() => setShowRulesInGame(false)}
                        className="mt-8 w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                      >
                        閉じる
                      </button>

                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )
          }
        </AnimatePresence >
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameLogic } from './hooks/useGameLogic';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { useTutorial } from './hooks/useTutorial';
import TitleScreen from './components/TitleScreen';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import InitialAudioModal from './components/InitialAudioModal';
import RulesContent from './components/RulesContent';
import Legend from './components/Legend';
import TutorialGuide from './components/TutorialGuide';
import { PIECE_SCORES, PIECE_COLORS } from './constants/colors';
import tryPasTheme from './assets/sounds/TRYPAS_Theme.mp3';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('LOCAL');
  const [showRulesInGame, setShowRulesInGame] = useState(false);
  const [isBoardOverview, setIsBoardOverview] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Background Music (Single instance for continuous playback)
  const bgm = useBackgroundMusic(tryPasTheme, 0.3);

  // Initial Audio Setup
  // Initial Audio Setup

  // 1. Called immediately on user interaction (click) to unlock audio context in mobile browsers
  // MUST be synchronous to maintain user gesture context on mobile
  const handleEnableAudio = () => {
    setIsMuted(false);
    bgm.setVolume(0.3);
    // Call play() synchronously - don't await or use .then() here
    // The bgm.play() will handle retries internally if needed
    const playResult = bgm.play();
    if (playResult !== false) {
      console.log("Audio playback initiated from user gesture");
    }
  };

  // 2. Called after modal animation
  const handleAudioSetupComplete = (soundEnabled) => {
    if (!soundEnabled) {
      setIsMuted(true);
      bgm.setVolume(0);
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
    jumpToReplayStep,
    getGameHint
  } = useGameLogic(gameMode);

  // Tutorial Mode
  const tutorial = useTutorial();

  const handleStartGame = (mode) => {
    // Trigger audio playback on user interaction (Chrome autoplay policy compliance)
    // Only play if audio is initialized and not muted
    if (audioInitialized && !isMuted) {
      bgm.play().catch(e => console.log("Audio play on game start failed:", e));
    }

    // Only reset if specifically requested, otherwise continue playing
    // bgm.reset(); // Removed to keep music playing seamlessly
    if (mode === 'TUTORIAL') {
      tutorial.startTutorial();
      setGameStarted(true);
      setGameMode('TUTORIAL');
    } else {
      setGameMode(mode);
      resetGame();
      setGameStarted(true);
    }
  };

  const handleBackToTitle = () => {
    if (tutorial.isTutorialMode) {
      tutorial.exitTutorial();
    }
    bgm.reset(); // Reset music when returning to title
    setGameStarted(false);
  };

  const isCPUMode = gameMode.startsWith('CPU_');
  const isSoloMode = gameMode === 'SOLO';
  const isTutorialMode = gameMode === 'TUTORIAL' && tutorial.isTutorialMode;

  const toggleAudio = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    const newVolume = newMutedState ? 0 : 0.3;
    bgm.setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container bg-gray-900 text-white font-sans selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center">
      {/* Music Control Button and Menu */}
      <InitialAudioModal onComplete={handleAudioSetupComplete} onEnableAudio={handleEnableAudio} />



      <div className="relative w-full max-w-[480px] h-full flex flex-col items-center justify-between py-4 px-2 md:p-4 overflow-hidden text-sm md:text-base safe-area-inset-bottom">

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
              <TitleScreen onStart={handleStartGame} onToggleAudio={toggleAudio} isMuted={isMuted} />
            </motion.div>
          ) : isTutorialMode ? (
            /* ========== TUTORIAL MODE ========== */
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col items-center justify-start"
              style={{ gap: 'clamp(0.25rem, 1vh, 0.75rem)', padding: 'clamp(0.25rem, 0.5vh, 0.5rem)' }}
            >
              {/* Header */}
              <div className="w-full flex-shrink-0 flex flex-row items-start justify-between px-2" style={{ marginBottom: 'clamp(0.25rem, 1vh, 0.5rem)' }}>
                <div className="flex flex-col items-start gap-2">
                  <img
                    src="/trypas-logo.png"
                    alt="TRYPAS"
                    className="opacity-90 drop-shadow-lg"
                    style={{ width: 'clamp(90px, 25vw, 120px)' }}
                  />
                  <div className="relative group">
                    <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-xl rounded-full border border-emerald-500/50" />
                    <div className="relative px-4 py-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                        TUTORIAL
                      </span>
                    </div>
                  </div>
                </div>
                {/* Tutorial Score */}
                <div className="bg-gray-800/80 border border-gray-600 rounded-xl px-4 py-2 text-center">
                  <div className="text-xs text-gray-400 font-bold">SCORE</div>
                  <div className="text-2xl font-black text-white">{tutorial.score}</div>
                </div>
              </div>

              {/* Tutorial Guide Message */}
              <div className="w-full flex-shrink-0 px-2" style={{ marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)' }}>
                <TutorialGuide
                  stepData={tutorial.currentStepData}
                  currentStep={tutorial.tutorialStep}
                  totalSteps={tutorial.totalSteps}
                  score={tutorial.score}
                  onAdvance={tutorial.advanceGuide}
                  onExit={handleBackToTitle}
                  isComplete={tutorial.isComplete}
                />
              </div>

              {/* Tutorial Game Board */}
              <div className="flex-1 w-full flex items-center justify-center min-h-0">
                <div className="w-full aspect-square" style={{ maxWidth: 'min(350px, calc(100vw - 2rem), calc(var(--vh, 1vh) * 100 - 280px))', maxHeight: 'calc(var(--vh, 1vh) * 100 - 280px)' }}>
                  <GameBoard
                    board={tutorial.board}
                    onSpotClick={tutorial.handleTutorialSpotClick}
                    selectedSpot={tutorial.selectedSpot}
                    validMoves={tutorial.currentStepData?.type === 'MOVE_TO' ? [{ end: tutorial.currentStepData.targetSpot }] : []}
                    highlightSpots={tutorial.currentStepData?.highlightSpots || []}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="w-full flex-shrink-0 px-2" style={{ marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)' }}>
                <Legend />
              </div>
            </motion.div>
          ) : (
            /* ========== NORMAL GAME MODE ========== */
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col items-center justify-start"
              style={{ gap: 'clamp(0.25rem, 1vh, 0.75rem)', padding: 'clamp(0.25rem, 0.5vh, 0.5rem)' }}
            >
              {/* 1. Header Area: Logo+Status (Left) vs Score (Right) */}
              <div className="w-full flex-shrink-0 flex flex-row items-start justify-between px-2" style={{ marginBottom: 'clamp(0.25rem, 1vh, 1rem)' }}>

                {/* Left: Logo & Status Pill */}
                <div className="flex flex-col items-start gap-3">
                  <img
                    src="/trypas-logo-new.png"
                    alt="TRYPAS"
                    className="opacity-90 drop-shadow-lg"
                    style={{ width: 'clamp(90px, 25vw, 140px)' }}
                  />

                  {/* Status Pill (Setup/Turn) */}
                  <div className="relative group">
                    <div
                      className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-full border border-gray-600"
                      style={{
                        borderColor: phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.5)' : (turn === 1 ? 'rgba(96, 165, 250, 0.5)' : 'rgba(251, 113, 133, 0.5)'),
                        boxShadow: `0 0 15px ${phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.2)' : (turn === 1 ? 'rgba(96, 165, 250, 0.2)' : 'rgba(251, 113, 133, 0.2)')}`
                      }}
                    />
                    <div className="relative px-5 py-1.5 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${phase === 'REMOVING' ? 'bg-yellow-400 animate-pulse' : (turn === 1 ? 'bg-blue-400' : 'bg-rose-400')}`}
                      />
                      <span
                        className={`text-xs font-bold tracking-widest uppercase ${phase === 'REMOVING' ? 'text-yellow-400' : (isSoloMode || turn === 1 ? 'text-blue-400' : 'text-rose-400')}`}
                      >
                        {phase === 'REMOVING' ? 'セットアップ' : (isReplaying ? 'リプレイ' : (isSoloMode ? 'SOLO PLAY' : (turn === 1 ? 'P1 ターン' : (isCPUMode ? 'CPU ターン' : 'P2 ターン'))))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: ScoreBoard */}
                <div className="flex-shrink-0 mt-2">
                  <ScoreBoard
                    scores={scores}
                    turn={turn}
                    phase={phase}
                    lastActionMessage={lastActionMessage}
                    gameMode={gameMode}
                    totalThinkingTime={totalThinkingTime}
                    capturedPieces={capturedPieces}
                    isReplaying={isReplaying}
                    compactMode={true}
                  />
                </div>
              </div>

              {/* Setup Instruction Message (Solo Mode Only) */}
              {/* Setup Instruction Message (Solo Mode Only) */}
              {isSoloMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === 'REMOVING' ? 1 : 0 }}
                  className="w-full text-center px-4"
                  style={{ marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)', visibility: phase === 'REMOVING' ? 'visible' : 'hidden' }}
                >
                  <p className="text-yellow-300 font-bold text-sm md:text-base drop-shadow-md bg-black/30 py-1 px-3 rounded-full inline-block backdrop-blur-sm border border-yellow-500/30">
                    赤コマ以外を一つ選択してください
                  </p>
                </motion.div>
              )}

              {/* 2. Game Board (Center) */}
              <div className="flex-1 w-full flex items-center justify-center min-h-0">
                <div className="w-full aspect-square" style={{ maxWidth: 'min(400px, calc(100vw - 2rem), calc(var(--vh, 1vh) * 100 - 280px))', maxHeight: 'calc(var(--vh, 1vh) * 100 - 280px)' }}>
                  <GameBoard
                    board={board}
                    onSpotClick={handleSpotClick}
                    selectedSpot={selectedSpot}
                    validMoves={validMoves}
                  />
                </div>
              </div>

              {/* 3. Footer Info (Timer, Legend, Buttons) */}
              <div className="w-full flex-shrink-0 flex flex-col items-center mb-2" style={{ gap: 'clamp(0.25rem, 0.5vh, 0.75rem)' }}>

                {/* Timer */}
                {!isReplaying && (
                  <div className="text-center">
                    <div className="font-black font-mono tracking-widest text-blue-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] bg-gray-900/50 px-6 py-1 rounded-full border border-gray-700/50" style={{ fontSize: 'clamp(1.125rem, 4vw, 1.75rem)' }}>
                      {phase === 'REMOVING' ? '00:00' : (isSoloMode ?
                        `${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}` :
                        `${Math.floor(turnTime / 60).toString().padStart(2, '0')}:${(turnTime % 60).toString().padStart(2, '0')}`
                      )}
                    </div>
                  </div>
                )}

                {/* Legend */}
                <Legend />

                {/* Controls Buttons */}
                <div className="w-full flex mt-1" style={{ gap: 'clamp(0.375rem, 1vw, 0.75rem)' }}>
                  <button onClick={handleBackToTitle} className="flex-1 bg-gray-800 text-white font-bold rounded-full border border-gray-600 hover:bg-gray-700 transition-all" style={{ padding: 'clamp(0.5rem, 1.5vh, 0.75rem) 0.5rem', fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)' }}>TITLE</button>
                  <button onClick={resetGame} className="flex-1 bg-gray-800 text-white font-bold rounded-full border border-gray-600 hover:bg-gray-700 transition-all" style={{ padding: 'clamp(0.5rem, 1.5vh, 0.75rem) 0.5rem', fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)' }}>RESET</button>
                  <button onClick={() => setShowRulesInGame(true)} className="flex-1 bg-gray-800 text-white font-bold rounded-full border border-gray-600 hover:bg-gray-700 transition-all" style={{ padding: 'clamp(0.5rem, 1.5vh, 0.75rem) 0.5rem', fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)' }}>ルール</button>
                  <button onClick={toggleAudio} className="flex-shrink-0 flex items-center justify-center bg-gray-800 text-white rounded-full border border-gray-600 hover:bg-gray-700 transition-all" style={{ width: 'clamp(40px, 10vw, 50px)', height: 'clamp(40px, 10vw, 50px)' }}>
                    <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
                  </button>
                </div>

                {/* Replay Controls (Conditional) */}
                <AnimatePresence>
                  {isReplaying && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full overflow-hidden">
                      <div className="flex gap-2 justify-center items-center bg-gray-800/90 p-3 rounded-xl border border-purple-500/50">
                        <span className="text-sm font-bold text-purple-300 mr-2">リプレイ {replayStep + 1}/{moveHistory.length}</span>
                        <button onClick={prevReplayStep} disabled={replayStep === 0} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-bold transition-colors">
                          <span>⏮️</span> 戻る
                        </button>
                        <button onClick={stopReplay} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 flex items-center gap-1 text-sm font-bold transition-colors">
                          <span>⏹️</span> 終了
                        </button>
                        <button onClick={nextReplayStep} disabled={replayStep >= moveHistory.length - 1} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-bold transition-colors">
                          <span>⏭️</span> 送る
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                    >
                      <div className="bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
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

                        {/* Unified Rules Content Component */}
                        <RulesContent />
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
          )}
        </AnimatePresence>

        {/* Game Over Modal */}
        <AnimatePresence>
          {phase === 'GAME_OVER' && !isReplaying && !isBoardOverview && (
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
                {/* Top Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-6 mt-2">
                  ゲーム終了
                </h2>

                {/* Result Display */}
                <div className="mb-6 text-gray-300">
                  {gameMode === 'SOLO' ? (
                    <div className="flex flex-row items-center justify-center gap-4">
                      {/* Score Card */}
                      <div className="flex flex-col items-center bg-black/20 p-4 rounded-2xl border border-white/10 min-w-[130px]">
                        <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-bold">Score</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-yellow-400 leading-none drop-shadow-md">
                            {scores.p1}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold">PTS</span>
                        </div>
                      </div>

                      {/* Time Card */}
                      <div className="flex flex-col items-center bg-black/20 p-4 rounded-2xl border border-white/10 min-w-[130px]">
                        <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-bold">Time</span>
                        <span className="text-2xl font-mono font-black text-white shadow-purple-500/50 drop-shadow-sm leading-none">
                          {formatTime(elapsedTime)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Time Display for VS */}
                      <div className="text-center mb-1">
                        <span className="text-gray-500 text-xs mr-2 uppercase tracking-wider">Total Time</span>
                        <span className="font-mono font-bold text-white">{formatTime(elapsedTime)}</span>
                      </div>

                      <div className="text-lg text-white">
                        <span className="text-gray-400">勝者: </span>
                        <span className={winner === 1 ? 'text-blue-400' : 'text-rose-400'}>
                          {winner === 1 ? 'プレイヤー1' : (gameMode.startsWith('CPU') ? 'CPU' : 'プレイヤー2')}
                        </span>
                      </div>
                      <div className="flex justify-center gap-4">
                        <div className="flex flex-col bg-gray-800/50 px-6 py-3 rounded-xl">
                          <span className="text-blue-400 font-medium text-sm">P1</span>
                          <span className="text-2xl font-bold text-white">{scores.p1}</span>
                        </div>
                        <div className="flex flex-col bg-gray-800/50 px-6 py-3 rounded-xl">
                          <span className="text-rose-400 font-medium text-sm">{gameMode.startsWith('CPU') ? 'CPU' : 'P2'}</span>
                          <span className="text-2xl font-bold text-white">{scores.p2}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  {/* Check Board Button */}
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
          )}
        </AnimatePresence>

        {/* Board Overview Return Button */}
        <AnimatePresence>
          {phase === 'GAME_OVER' && !isReplaying && isBoardOverview && (
            <>
              {/* Hint Banner */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute top-4 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
              >
                <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/20">
                  <p className="text-white font-bold text-sm">
                    💡 {getGameHint()}
                  </p>
                </div>
              </motion.div>

              {/* Return Button */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-8 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-auto"
              >
                <button
                  onClick={() => setIsBoardOverview(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg border border-blue-400/50 backdrop-blur-md flex items-center gap-2 transform hover:scale-105 transition-all"
                >
                  <span>↩️</span> 結果画面に戻る
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

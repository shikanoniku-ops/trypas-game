import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameLogic } from './hooks/useGameLogic';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { useTutorial } from './hooks/useTutorial';
import TitleScreen from './components/TitleScreen';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import InitialAudioModal from './components/InitialAudioModal';
import RulesContentNew from './components/RulesContentNew';
import Legend from './components/Legend';
import TutorialGuide from './components/TutorialGuide';
import GameOverModal from './components/GameOverModal';
import CyberpunkBackground from './components/CyberpunkBackground';
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
    replayScores,
    replayTurn,
    startReplay,
    stopReplay,
    nextReplayStep,
    prevReplayStep,
    jumpToReplayStep,
    showTrypas,
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

    // Reset board overview state
    setIsBoardOverview(false);

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
    <div className="app-container bg-[#080810] text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col items-center justify-center">
      {/* Unified Cyberpunk Background for all screens */}
      <CyberpunkBackground />

      {/* Music Control Button and Menu */}
      <InitialAudioModal onComplete={handleAudioSetupComplete} onEnableAudio={handleEnableAudio} />

      <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden text-sm md:text-base" style={{ padding: 'clamp(0.25rem, 1vh, 1rem) clamp(0.25rem, 1vw, 0.5rem)', maxWidth: 'min(480px, 100vw)' }}>

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
                    src={`${import.meta.env.BASE_URL}trypas-logo-new.png`}
                    alt="TRYPAS"
                    className="opacity-95"
                    style={{ width: 'clamp(90px, 25vw, 120px)', filter: 'drop-shadow(0 0 15px rgba(0,255,255,0.3))' }}
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

              {/* Navigation Buttons - Above the board */}
              <div className="w-full flex-shrink-0 flex justify-center gap-4 px-4" style={{ marginBottom: 'clamp(0.25rem, 1vh, 0.5rem)' }}>
                <button
                  onClick={handleBackToTitle}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-lg border border-orange-400/50"
                  style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)' }}
                >
                  TOPに戻る
                </button>
                <button
                  onClick={() => {
                    tutorial.exitTutorial();
                    setGameMode('SOLO');
                    resetGame();
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-lg border border-green-400/50"
                  style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)' }}
                >
                  ゲームを始める
                </button>
              </div>

              {/* Tutorial Game Board */}
              <div className="flex-1 w-full flex items-center justify-center min-h-0">
                <div className="w-full aspect-square" style={{ maxWidth: 'min(380px, calc(100vw - 2rem), calc(var(--vh, 1vh) * 100 - 320px))', maxHeight: 'calc(var(--vh, 1vh) * 100 - 320px)' }}>
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
                    src={`${import.meta.env.BASE_URL}trypas-logo-new.png`}
                    alt="TRYPAS"
                    className="opacity-95"
                    style={{ width: 'clamp(90px, 25vw, 140px)', filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.3))' }}
                  />

                  {/* Status Pill (Cyberpunk Style) */}
                  <div className="relative group">
                    <div
                      className="absolute inset-0 bg-gray-950/80 backdrop-blur-xl rounded-lg"
                      style={{
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.4)' : (turn === 1 ? 'rgba(0, 220, 255, 0.4)' : 'rgba(255, 100, 100, 0.4)'),
                        boxShadow: `0 0 20px ${phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.15)' : (turn === 1 ? 'rgba(0, 220, 255, 0.15)' : 'rgba(255, 100, 100, 0.15)')}`
                      }}
                    />
                    <div className="relative px-4 py-1.5 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${phase === 'REMOVING' ? 'bg-yellow-400' : (turn === 1 ? 'bg-cyan-400' : 'bg-red-400')}`}
                        style={{ boxShadow: `0 0 8px ${phase === 'REMOVING' ? 'rgba(250, 204, 21, 0.8)' : (turn === 1 ? 'rgba(0, 220, 255, 0.8)' : 'rgba(255, 100, 100, 0.8)')}` }}
                      />
                      <span
                        className={`text-xs font-bold font-mono tracking-widest uppercase ${phase === 'REMOVING' ? 'text-yellow-400' : (isSoloMode || turn === 1 ? 'text-cyan-400' : 'text-red-400')}`}
                      >
                        {phase === 'REMOVING' ? 'SETUP' : (isReplaying ? 'REPLAY' : (isSoloMode ? 'SOLO PLAY' : (turn === 1 ? (isCPUMode ? 'YOU' : 'PLAYER 1') : (isCPUMode ? 'CPU' : 'PLAYER 2'))))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: ScoreBoard */}
                <div className="flex-shrink-0 mt-2">
                  <ScoreBoard
                    scores={isReplaying ? replayScores : scores}
                    turn={isReplaying ? replayTurn : turn}
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
              <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
                <div className="w-full aspect-square relative" style={{ maxWidth: 'min(90vw, calc(var(--vh, 1vh) * 100 - 180px))', maxHeight: 'calc(var(--vh, 1vh) * 100 - 180px)' }}>
                  <GameBoard
                    board={board}
                    onSpotClick={handleSpotClick}
                    selectedSpot={selectedSpot}
                    validMoves={validMoves}
                  />
                  {/* TRYPAS! Notification Animation (Cyberpunk Style) */}
                  <AnimatePresence>
                    {showTrypas && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden"
                      >
                        {/* Cyber Glitch Text Container */}
                        <div className="relative">
                          {/* Glitch Layer 1 */}
                          <motion.span
                            initial={{ x: -2, opacity: 0 }}
                            animate={{
                              x: [-2, 2, -1, 3, 0],
                              opacity: [0, 0.8, 0]
                            }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                            className={`absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter select-none blur-[1px] ${turn === 2 ? 'text-red-500' : 'text-blue-500'}`}
                            style={{ clipPath: 'inset(40% 0 60% 0)' }}
                          >
                            TRYPAS!
                          </motion.span>

                          {/* Glitch Layer 2 */}
                          <motion.span
                            initial={{ x: 2, opacity: 0 }}
                            animate={{
                              x: [2, -2, 1, -3, 0],
                              opacity: [0, 0.8, 0]
                            }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
                            className={`absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter select-none blur-[1px] ${turn === 2 ? 'text-orange-400' : 'text-cyan-400'}`}
                            style={{ clipPath: 'inset(10% 0 40% 0)' }}
                          >
                            TRYPAS!
                          </motion.span>

                          {/* Main Text */}
                          <motion.h1
                            initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="relative text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter text-white z-10"
                            style={{
                              textShadow: turn === 2
                                ? "0 0 10px rgba(255,50,50,0.8), 0 0 20px rgba(255,50,50,0.5), 0 0 40px rgba(255,50,50,0.3)"
                                : "0 0 10px rgba(0,170,255,0.8), 0 0 20px rgba(0,170,255,0.5), 0 0 40px rgba(0,170,255,0.3)"
                            }}
                          >
                            <span className={`bg-gradient-to-b bg-clip-text text-transparent ${turn === 2 ? 'from-white via-red-100 to-orange-200' : 'from-white via-cyan-100 to-blue-200'}`}>
                              TRYPAS!
                            </span>

                            {/* Neon Glow Outline */}
                            <span className={`absolute inset-0 blur-sm select-none ${turn === 2 ? 'text-red-400/40' : 'text-cyan-400/40'}`} aria-hidden="true">
                              TRYPAS!
                            </span>
                          </motion.h1>

                          {/* Horizontal Scan Line */}
                          <motion.div
                            initial={{ top: '0%', opacity: 0 }}
                            animate={{ top: '100%', opacity: [0, 1, 0] }}
                            transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                            className={`absolute left-0 right-0 h-[2px] z-20 ${turn === 2 ? 'bg-red-400/70 shadow-[0_0_10px_#ff4444]' : 'bg-cyan-400/70 shadow-[0_0_10px_#00ffff]'}`}
                          />

                          {/* Flash Effect */}
                          <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-white mix-blend-overlay rounded-lg"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 3. Footer Info (Timer, Legend, Buttons) */}
              <div className="w-full flex-shrink-0 flex flex-col items-center mb-2" style={{ gap: 'clamp(0.25rem, 0.5vh, 0.75rem)' }}>

                {/* Timer or Board Overview Button */}
                {phase === 'GAME_OVER' && isBoardOverview ? (
                  <div className="flex flex-col items-center gap-2">
                    {/* ヒントバナー */}
                    {getGameHint() && (
                      <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <p className="text-white font-bold text-sm">
                          💡 {getGameHint()}
                        </p>
                      </div>
                    )}
                    {/* 戻るボタン */}
                    <button
                      onClick={() => setIsBoardOverview(false)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-lg border border-blue-400/50 backdrop-blur-md flex items-center gap-2 transform hover:scale-105 transition-all"
                      style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}
                    >
                      <span>↩️</span> 結果画面に戻る
                    </button>
                  </div>
                ) : phase !== 'GAME_OVER' && !isReplaying && (
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
                        <span className="text-sm font-bold text-purple-300 mr-2">リプレイ {replayStep}/{moveHistory.length}</span>
                        <button onClick={prevReplayStep} disabled={replayStep === 0} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-bold transition-colors">
                          <span>⏮️</span> 戻る
                        </button>
                        <button onClick={stopReplay} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 flex items-center gap-1 text-sm font-bold transition-colors">
                          <span>⏹️</span> 終了
                        </button>
                        <button onClick={nextReplayStep} disabled={replayStep >= moveHistory.length} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-bold transition-colors">
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
                      <div className="bg-gray-950 p-6 sm:p-8 rounded-2xl border border-cyan-400/25 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[0_0_50px_rgba(0,255,255,0.1)] scrollable-content text-left" onClick={e => e.stopPropagation()}>
                        <RulesContentNew />
                        <button
                          onClick={() => setShowRulesInGame(false)}
                          className="mt-6 w-full py-3.5 bg-cyan-500/10 text-cyan-400 font-bold rounded-xl border border-cyan-400/35 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all"
                        >
                          CLOSE
                        </button>
                      </div>

                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Modal */}
        <AnimatePresence>
          <GameOverModal
            phase={phase}
            isReplaying={isReplaying}
            isBoardOverview={isBoardOverview}
            setIsBoardOverview={setIsBoardOverview}
            gameMode={gameMode}
            scores={scores}
            winner={winner}
            elapsedTime={elapsedTime}
            moveHistory={moveHistory}
            formatTime={formatTime}
            resetGame={resetGame}
            startReplay={startReplay}
            handleBackToTitle={handleBackToTitle}
            getGameHint={getGameHint}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

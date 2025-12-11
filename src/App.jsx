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

  // Tutorial Mode
  const tutorial = useTutorial();

  const handleStartGame = (mode) => {
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
    setGameStarted(false);
  };

  const isCPUMode = gameMode.startsWith('CPU_');
  const isSoloMode = gameMode === 'SOLO';
  const isTutorialMode = gameMode === 'TUTORIAL' && tutorial.isTutorialMode;

  const currentBGM = gameStarted ? gameBGM : titleBGM;

  const toggleAudio = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    const newVolume = newMutedState ? 0 : 0.3;
    titleBGM.setVolume(newVolume);
    gameBGM.setVolume(newVolume);
  };

  return (
    <div className="app-container bg-gray-900 text-white font-sans selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center">
      {/* Music Control Button and Menu */}
      <InitialAudioModal onComplete={handleAudioSetup} />



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
              className="w-full h-full flex flex-col items-center justify-between"
            >
              {/* Header */}
              <div className="w-full flex-shrink-0 flex flex-row items-start justify-between mb-2 px-2">
                <div className="flex flex-col items-start gap-2">
                  <img
                    src="/trypas-logo.png"
                    alt="TRYPAS"
                    className="w-[120px] opacity-90 drop-shadow-lg"
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
              <div className="w-full flex-shrink-0 px-2 mb-2">
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
              <div className="flex-grow flex items-center justify-center w-full min-h-0 py-1">
                <div className="w-full max-w-[350px] aspect-square max-h-full">
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
              <div className="w-full flex-shrink-0 px-2 mb-2">
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
              className="w-full h-full flex flex-col items-center justify-between"
            >
              {/* 1. Header Area: Logo+Status (Left) vs Score (Right) */}
              <div className="w-full flex-shrink-0 flex flex-row items-start justify-between mb-4 px-2">

                {/* Left: Logo & Status Pill */}
                <div className="flex flex-col items-start gap-3">
                  <img
                    src="/trypas-logo.png"
                    alt="TRYPAS"
                    className="w-[140px] opacity-90 drop-shadow-lg"
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

              {/* Spacer (Auto Adjust) */}
              <div className="flex-grow min-h-2" />

              {/* 2. Game Board (Center) */}
              <div className="flex-shrink-1 w-full flex items-center justify-center min-h-0">
                <div className="w-full max-w-[400px] aspect-square max-h-full">
                  <GameBoard
                    board={board}
                    onSpotClick={handleSpotClick}
                    selectedSpot={selectedSpot}
                    validMoves={validMoves}
                  />
                </div>
              </div>

              {/* Spacer (Auto Adjust) */}
              <div className="flex-grow min-h-2" />

              {/* 3. Footer Info (Timer, Legend, Buttons) */}
              <div className="w-full flex-shrink-0 flex flex-col items-center gap-3 mb-2">

                {/* Timer */}
                {!isReplaying && (
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono tracking-widest text-blue-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)] bg-gray-900/50 px-6 py-1 rounded-full border border-gray-700/50">
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
                <div className="w-full flex gap-3 mt-1">
                  <button onClick={handleBackToTitle} className="flex-1 py-3 bg-gray-800 text-white text-sm font-bold rounded-full border border-gray-600 hover:bg-gray-700 transition-all">TITLE</button>
                  <button onClick={resetGame} className="flex-1 py-3 bg-gray-800 text-white text-sm font-bold rounded-full border border-gray-600 hover:bg-gray-700 transition-all">RESET</button>
                  <button onClick={() => setShowRulesInGame(true)} className="flex-1 py-3 bg-gray-800 text-white text-sm font-bold rounded-full border border-gray-600 hover:bg-gray-700 transition-all">ルール</button>
                  <button onClick={toggleAudio} className="w-[50px] flex-shrink-0 flex items-center justify-center bg-gray-800 text-white rounded-full border border-gray-600 hover:bg-gray-700 transition-all">
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

                      {/* Unified Rules Content Component */}
                      <RulesContent />

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
          {phase === 'GAME_OVER' && !isReplaying && (
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
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-gray-400 text-sm">スコア</span>
                      <span className="text-5xl font-bold text-white">
                        {scores.p1}
                      </span>
                      <span className="text-gray-500 text-sm">ポイント</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
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
      </div>
    </div>
  );
}

export default App;

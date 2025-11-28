import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameLogic } from './hooks/useGameLogic';
import TitleScreen from './components/TitleScreen';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('LOCAL');

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
    resetGame
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

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="title"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
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
            className="absolute inset-0 flex flex-col items-center justify-center p-4"
          >
            {/* Game Header */}
            <ScoreBoard
              scores={scores}
              turn={turn}
              phase={phase}
              lastActionMessage={lastActionMessage}
              gameMode={gameMode}
            />

            {/* Game Board */}
            <div className="flex-grow flex items-center justify-center w-full">
              <GameBoard
                board={board}
                onSpotClick={handleSpotClick}
                selectedSpot={selectedSpot}
                validMoves={validMoves}
              />
            </div>

            {/* Game Footer / Controls */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-bold text-sm tracking-wider"
              >
                RESET
              </button>
              <button
                onClick={handleBackToTitle}
                className="px-6 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-bold text-sm tracking-wider"
              >
                TITLE
              </button>
            </div>

            {/* Winner Overlay */}
            <AnimatePresence>
              {winner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center max-w-sm mx-4 shadow-2xl"
                  >
                    <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                      {winner === 'SOLO' ? 'ゲーム終了!' :
                        winner === 'DRAW' ? '引き分け!' :
                          `${winner === 1 ? 'PLAYER 1' : (isCPUMode ? 'CPU' : 'PLAYER 2')} 勝利!`}
                    </h2>
                    <p className="text-gray-400 mb-6">
                      {isSoloMode ? `最終スコア: ${scores.p1}点` : `最終スコア: ${scores.p1} - ${scores.p2}`}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform"
                      >
                        もう一度
                      </button>
                      <button
                        onClick={handleBackToTitle}
                        className="px-6 py-3 bg-gray-700 text-white font-bold rounded-full hover:bg-gray-600 transition-colors"
                      >
                        タイトルへ
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

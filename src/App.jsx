import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameLogic } from './hooks/useGameLogic';
import TitleScreen from './components/TitleScreen';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import { PIECE_SCORES } from './constants/colors';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('LOCAL');
  const [showRulesInGame, setShowRulesInGame] = useState(false);

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
                onClick={handleBackToTitle}
                className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                TITLE
              </button>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                RESET
              </button>
              <button
                onClick={() => setShowRulesInGame(true)}
                className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                ルール説明
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
                    <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-2">トライパスの説明</h2>

                    <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
                      <section className="bg-gray-700/30 p-4 rounded-lg">
                        <p className="text-gray-200">
                          トライパスは、遊びながら思考力、記憶力、創造力が鍛えられ、頭がよくなります。また1億以上の陣形がある驚くほど奥深いゲームですが、簡単に誰でもすぐにプレーできます。
                        </p>
                      </section>

                      <section>
                        <h3 className="text-lg font-bold text-blue-400 mb-3 border-l-4 border-blue-400 pl-3">トライパスの遊び方（二人対戦ゲーム）</h3>
                        <ol className="space-y-2 pl-5">
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">①</span>
                            <span>先手、後手を決め、後手が全コマの配置をします。<span className="text-gray-400">（陣形作り）</span></span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">②</span>
                            <span>先手はこれらのコマを盤面から1個取ります。</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">③</span>
                            <span>後手は隣りのコマ2～3コマはトナメの交差点に連続に1コマだけ飛びこし、飛びこされたコマを盤面から取ります。</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">④</span>
                            <span><strong className="text-red-400">赤コマをこえればトライパスで、続けてもう一度行います。</strong> ただし、<strong>最後の赤コマをこえると負けです。</strong></span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">⑤</span>
                            <span>コマをこえて飛ぶことができ、最後に取べない方負けです。</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">⑥</span>
                            <span>その回の勝者は取ったコマの色に応じて得点します。その回の敗者は得点なしです。</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">⑦</span>
                            <span>白ごとに、先手と後手が交互に入れかわります。</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-blue-300 shrink-0">⑧</span>
                            <span>勝敗は規定得点の先取または勝数で競います。</span>
                          </li>
                        </ol>
                        <div className="mt-3 text-xs text-gray-400 italic">
                          規定得点は1000点、ハーフ戦は500点です。
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-bold text-yellow-400 mb-3 border-l-4 border-yellow-400 pl-3">コマの点数</h3>
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#FF6B6B]"></div>
                              <span className="font-bold">赤: {PIECE_SCORES.RED}点</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#FFE66D]"></div>
                              <span className="font-bold">黄: {PIECE_SCORES.YELLOW}点</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#4ECDC4]"></div>
                              <span className="font-bold">緑: {PIECE_SCORES.GREEN}点</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#45B7D1]"></div>
                              <span className="font-bold">青: {PIECE_SCORES.BLUE}点</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#F7FFF7]"></div>
                              <span className="font-bold">白: {PIECE_SCORES.WHITE}点</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 text-center">各色3個ずつ</p>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-bold text-purple-400 mb-3 border-l-4 border-purple-400 pl-3">詰めトライパスについて</h3>
                        <p className="text-gray-200">
                          終盤までの数手前から、終盤まで行ないます。詰めトライパスは1人で楽しめ、戦略研究に役立ちます。
                        </p>
                      </section>

                      <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-blue-700/50">
                        <h3 className="text-base font-bold text-blue-300 mb-2">💡 遊びながら頭脳トレーニング</h3>
                        <ul className="space-y-1 text-xs">
                          <li>✓ 開始陣形は<strong className="text-yellow-300">1億以上</strong>あります</li>
                          <li>✓ 必ず<strong className="text-yellow-300">14手以内</strong>で勝負がつきます</li>
                          <li>✓ 左脳パワー：論理力・判断力・記憶力</li>
                          <li>✓ 右脳パワー：創造力・集中力・注意力</li>
                        </ul>
                      </section>
                    </div>

                    <button
                      onClick={() => setShowRulesInGame(false)}
                      className="mt-8 w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      閉じる
                    </button>
                    <button
                      onClick={handleBackToTitle}
                      className="mt-3 w-full py-3 bg-gray-800 text-white font-bold rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      TITLE
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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

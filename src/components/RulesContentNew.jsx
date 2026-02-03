import React from 'react';
import { PIECE_SCORES } from '../constants/colors';
import Piece from './Piece';

/**
 * 新しいルール説明コンテンツ（青系ポップサイバーパンク & スマホ最適化）
 * TitleScreen.jsx と App.jsx の両方で使用
 * 
 * コンセプト:
 * - 威圧感を排除した明るめのダークモード（Blue/Cyanベース）
 * - ポップで見やすいタイポグラフィとアイコン
 * - 縦並びレイアウト（スマホファースト）
 */
const RulesContentNew = () => {
    return (
        <div className="space-y-8 text-blue-100/90 leading-relaxed text-sm font-sans">
            {/* ヘッダーセクション */}
            <div className="text-center space-y-3 mb-8">
                <div className="relative inline-block group">
                    <img
                        src={`${import.meta.env.BASE_URL}trypas-logo-new.png`}
                        alt="TRYPAS"
                        className="mx-auto transform transition-transform group-hover:scale-105 duration-500"
                        style={{
                            width: 'clamp(140px, 40vw, 180px)',
                            filter: 'drop-shadow(0 0 15px rgba(34,211,238,0.4))'
                        }}
                    />
                    <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
                <div className="mt-2 inline-block bg-blue-950/60 border border-cyan-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    <p className="text-[10px] text-cyan-300 font-bold tracking-widest uppercase">
                        Official Rulebook
                    </p>
                </div>
            </div>

            {/* ゲーム概要 */}
            <section className="bg-gradient-to-br from-slate-900/80 to-blue-900/40 p-6 rounded-2xl border border-blue-500/20 shadow-lg relative overflow-hidden backdrop-blur-md">
                <div className="relative z-10">
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-xl">🌍</span> 世界初の盤上ゲーム
                    </h3>
                    <p className="text-sm leading-7 mb-4">
                        <strong className="text-cyan-300 font-bold">TRYPAS</strong>（トライパス）は、年齢や経験を問わず、誰もが対等に楽しめる戦略ボードゲームです。
                    </p>
                    <div className="bg-blue-950/50 rounded-xl p-4 border border-cyan-500/30 shadow-inner">
                        <p className="text-sm text-blue-50 leading-relaxed">
                            ルールは超シンプル！<br />
                            5色・合計15個のコマを取り合い、<br />
                            <strong className="text-cyan-300 border-b border-cyan-500/50 pb-0.5">次に動かせる場所がなくなった方が負け</strong>です。
                        </p>
                    </div>
                </div>
            </section>

            {/* 遊び方の流れ */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-blue-800">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500 text-blue-950 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]">▶</span>
                    遊び方の流れ
                </h3>

                <div className="grid gap-4">
                    {/* Step 1 */}
                    <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">STEP</span>
                                <span className="text-3xl font-black text-white leading-none text-shadow-cyan">01</span>
                            </div>
                            <div className="pt-1">
                                <h4 className="text-cyan-300 font-bold text-sm mb-2">最初の1手</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    盤上から<span className="font-bold text-white">好きなコマを1個</span>取って自分の得点にします。<br />
                                    <span className="text-xs text-red-400 font-bold mt-1.5 block flex items-center gap-1">
                                        <span>⚠️</span> 最初に「赤コマ」は取れません！
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">STEP</span>
                                <span className="text-3xl font-black text-white leading-none text-shadow-cyan">02</span>
                            </div>
                            <div className="pt-1 w-full">
                                <h4 className="text-cyan-300 font-bold text-sm mb-2">コマの移動</h4>
                                <p className="text-sm text-slate-300 mb-3">
                                    条件を満たしてジャンプ！<br />飛び越えたコマをGETします。
                                </p>
                                <ul className="text-xs text-slate-300 space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                        <span><strong className="text-white">直線方向</strong>（横・斜め）に動く</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                        <span>間のコマを <strong className="text-white">1〜3個</strong> 飛び越える</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                        <span>必ず <strong className="text-yellow-300">空いている穴</strong> に着地する</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                                        <span><strong className="text-pink-300">着地した手前</strong>のコマが得点になる</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">STEP</span>
                                <span className="text-3xl font-black text-white leading-none text-shadow-cyan">03</span>
                            </div>
                            <div className="pt-1">
                                <h4 className="text-cyan-300 font-bold text-sm mb-2">勝敗の決着</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    交互に繰り返して...<br />
                                    <strong className="text-white bg-cyan-900/50 px-1 rounded">動かせるコマがなくなった時点</strong>でゲーム終了！<br />
                                    <span className="text-xs text-cyan-400 mt-1 block">★最後の一手を打った人の勝利です</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* コマの点数表 */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-blue-800">
                    <span className="w-8 h-8 rounded-lg bg-green-500 text-blue-950 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(34,197,94,0.5)]">★</span>
                    コマの点数
                </h3>

                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 relative overflow-hidden">
                    <div className="grid grid-cols-5 gap-2 relative z-10">
                        {/* 50点: 白 */}
                        <div className="flex flex-col items-center gap-1.5 group">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 mx-auto transform group-hover:scale-125 transition-transform">
                                <Piece color="WHITE" />
                            </div>
                            <div className="text-center">
                                <span className="block text-xs sm:text-sm font-black text-white leading-none mb-0.5">{PIECE_SCORES.WHITE}</span>
                                <span className="text-[8px] text-slate-400 font-bold block leading-none">pts</span>
                            </div>
                        </div>

                        {/* 40点: 青 */}
                        <div className="flex flex-col items-center gap-1.5 group">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 mx-auto transform group-hover:scale-125 transition-transform">
                                <Piece color="BLUE" />
                            </div>
                            <div className="text-center">
                                <span className="block text-xs sm:text-sm font-black text-white leading-none mb-0.5">{PIECE_SCORES.BLUE}</span>
                                <span className="text-[8px] text-slate-400 font-bold block leading-none">pts</span>
                            </div>
                        </div>

                        {/* 30点: 緑 */}
                        <div className="flex flex-col items-center gap-1.5 group">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 mx-auto transform group-hover:scale-125 transition-transform">
                                <Piece color="GREEN" />
                            </div>
                            <div className="text-center">
                                <span className="block text-xs sm:text-sm font-black text-white leading-none mb-0.5">{PIECE_SCORES.GREEN}</span>
                                <span className="text-[8px] text-slate-400 font-bold block leading-none">pts</span>
                            </div>
                        </div>

                        {/* 20点: 黄 */}
                        <div className="flex flex-col items-center gap-1.5 group">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 mx-auto transform group-hover:scale-125 transition-transform">
                                <Piece color="YELLOW" />
                            </div>
                            <div className="text-center">
                                <span className="block text-xs sm:text-sm font-black text-white leading-none mb-0.5">{PIECE_SCORES.YELLOW}</span>
                                <span className="text-[8px] text-slate-400 font-bold block leading-none">pts</span>
                            </div>
                        </div>

                        {/* 10点: 赤 */}
                        <div className="flex flex-col items-center gap-1.5 group">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 mx-auto transform group-hover:scale-125 transition-transform">
                                <Piece color="RED" />
                            </div>
                            <div className="text-center">
                                <span className="block text-xs sm:text-sm font-black text-red-400 leading-none mb-0.5">{PIECE_SCORES.RED}</span>
                                <span className="text-[8px] text-red-400/70 font-bold block leading-none">pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 赤コマの重要ルール - Pop Cyberpunk Blue Edition */}
            <section className="relative overflow-hidden rounded-2xl border-2 border-cyan-400/30 bg-gradient-to-br from-blue-900/30 to-slate-900/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                {/* ヘッダー */}
                <div className="bg-blue-950/40 p-4 border-b border-cyan-400/20 flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8">
                        <Piece color="RED" />
                    </div>
                    <h3 className="text-lg font-black text-cyan-50 text-shadow-sm tracking-wider">
                        赤コマの<span className="text-cyan-300">特殊ルール</span>
                    </h3>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                    {/* トライパス宣言 */}
                    <div className="text-center space-y-3">
                        <p className="text-sm text-cyan-200/80 font-bold">
                            対戦中に<span className="text-red-400 inline-block px-1">赤コマ</span>を取ったら...
                        </p>

                        <div className="py-2 sm:py-4 relative">
                            {/* モバイル調整: テキストサイズを画面幅に合わせて調整 */}
                            <div className="text-3xl sm:text-4xl font-black text-white tracking-[0.1em] transform rotate-[-2deg] drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                                「トライパス！」
                            </div>
                            {/* 背景グロー */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/10 blur-xl rounded-full -z-10"></div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl px-4 py-3 mx-auto max-w-sm w-full backdrop-blur-sm">
                            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-bold">
                                元気に宣言して <span className="text-yellow-300 border-b border-yellow-300 mx-1">もう一度プレイ</span> しよう！
                            </p>
                        </div>
                    </div>

                    {/* ルールカード（縦並び・ポップ） */}
                    <div className="grid gap-3">
                        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-600/50 flex items-center gap-4 hover:bg-slate-700/60 transition-colors">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-xl border border-slate-600">
                                �
                            </div>
                            <div className="flex-grow">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Rule 01</span>
                                <p className="text-sm text-white font-bold">
                                    最初は<span className="text-red-400">赤コマ</span>を取れない
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-600/50 flex items-center gap-4 hover:bg-slate-700/60 transition-colors">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-xl border border-slate-600">
                                ☠️
                            </div>
                            <div className="flex-grow">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Rule 02</span>
                                <p className="text-sm text-white font-bold">
                                    最後の一手で赤を取ると<span className="text-red-400 border-b-2 border-red-400/50 ml-1">負け</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* モード別ルール - ポップデザイン */}
            <section className="space-y-6">
                {/* 対戦ルール */}
                <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 rounded-2xl border border-purple-500/30 p-1 overflow-hidden">
                    <div className="bg-slate-900/40 rounded-xl p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xl shadow-lg shadow-purple-500/30 flex-shrink-0">
                                ⚔️
                            </div>
                            <div>
                                <h3 className="text-base font-black text-white tracking-wide">対戦モード</h3>
                                <p className="text-[10px] text-purple-300 font-bold opacity-70">VERSUS MODE</p>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-purple-200 mb-1">
                                    🏆 勝利条件
                                </h4>
                                <ul className="text-xs text-purple-100/80 space-y-1 pl-4">
                                    <li>• 相手より後に最後の一手を打つ</li>
                                    <li>• 相手を「手詰まり」にさせる</li>
                                </ul>
                            </div>
                            <div className="bg-pink-500/10 p-3 rounded-lg border border-pink-500/20">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-pink-200 mb-1">
                                    💀 敗北条件
                                </h4>
                                <ul className="text-xs text-pink-100/80 space-y-1 pl-4">
                                    <li>• 自分の番で動かせる場所がない</li>
                                    <li>• <span className="text-pink-300 font-bold">最後の一手</span>で赤コマを取る</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <span className="text-[10px] text-white/50 font-bold bg-white/5 px-3 py-1 rounded-full">
                                完全決着（引き分けなし）
                            </span>
                        </div>
                    </div>
                </div>

                {/* ソロルール */}
                <div className="bg-gradient-to-br from-yellow-900/20 to-slate-900/50 rounded-2xl border border-yellow-500/30 p-1 overflow-hidden">
                    <div className="bg-slate-900/40 rounded-xl p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500 text-yellow-950 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30 flex-shrink-0">
                                🧘
                            </div>
                            <div>
                                <h3 className="text-base font-black text-white tracking-wide">ソロプレイ</h3>
                                <p className="text-[10px] text-yellow-500 font-bold opacity-70">SOLO TRAINING</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-yellow-100/80 leading-relaxed bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10">
                                ひとりでじっくり練習できるモード。<br />
                                獲得したコマの点数がそのままスコアになります。
                            </p>

                            <div className="bg-gradient-to-r from-yellow-500/20 to-transparent p-4 rounded-xl border border-yellow-400/30 flex flex-col items-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/20 blur-xl rounded-full"></div>

                                <div className="text-xs font-bold text-yellow-300 mb-1 uppercase tracking-wider">High Score Goal</div>
                                <div className="text-4xl font-black text-white mb-2 tabular-nums tracking-tighter text-shadow-yellow">
                                    440<span className="text-sm font-bold text-yellow-500/80 ml-1">pts</span>
                                </div>
                                <div className="bg-slate-900/60 px-3 py-1.5 rounded-full text-[10px] text-slate-300 border border-yellow-500/20 shadow-sm">
                                    <span className="text-yellow-400 font-bold mr-1">MISSION:</span>
                                    赤コマ1個だけを残して終了
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* フッタークレジット */}
            <div className="pt-8 border-t border-slate-800 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
                <p className="text-[10px] text-slate-400 tracking-widest font-mono">
                    GAME DESIGN by Dr. Q
                </p>
            </div>
        </div>
    );
};

export default RulesContentNew;

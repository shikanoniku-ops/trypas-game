/**
 * TRYPAS チュートリアルシナリオ - 苦戦しながら赤1個残し
 * 
 * ボードレイアウト:
 *       0
 *      1 2
 *     3 4 5
 *    6 7 8 9
 * 10 11 12 13 14
 * 
 * このシナリオは最高得点ではないが、赤1個残しを達成する
 * 途中で「仕方なく低得点を取る」場面を含む
 */

export const TUTORIAL_INITIAL_BOARD = [
    'YELLOW',  // 0 - 初手で取り除く（低得点を選択）
    'GREEN',   // 1
    'WHITE',   // 2
    'RED',     // 3 - 最後に残る
    'BLUE',    // 4
    'YELLOW',  // 5
    'WHITE',   // 6
    'RED',     // 7 - 途中で取得（赤を取ると連続ターン）
    'GREEN',   // 8
    'BLUE',    // 9
    'YELLOW',  // 10
    'WHITE',   // 11
    'RED',     // 12 - 途中で取得
    'GREEN',   // 13
    'BLUE',    // 14
];

// チュートリアルの各ステップ
export const TUTORIAL_STEPS = [
    {
        type: 'INTRO',
        message: 'TRYPASチュートリアル\n赤1個残しに挑戦！',
        subMessage: 'タップして次へ',
        highlightSpots: [],
    },
    {
        type: 'EXPLAIN',
        message: '赤を取ると連続ターン！\n最後に赤1個残すのが目標です。',
        subMessage: '戦略的に進めましょう',
        highlightSpots: [],
    },

    // 初手: 0番(YELLOW)を取り除く
    {
        type: 'REMOVE',
        message: '【初手】最初は好きな場所を選べます。\n試しに黄(2点)をタップ！',
        subMessage: '最初の1個を取り除いてスペースを作ります',
        targetSpot: 0,
        highlightSpots: [0],
    },

    // Move 1
    {
        type: 'MOVE',
        message: '【1】赤を選択',
        subMessage: '3番をタップ',
        selectSpot: 3,
        highlightSpots: [3],
    },
    {
        type: 'MOVE_TO',
        message: '緑(3点)を飛び越えて獲得！',
        subMessage: '0番をタップ',
        targetSpot: 0,
        highlightSpots: [0],
        capturedSpot: 1,
        gainPoints: 3,
    },

    // Move 2
    {
        type: 'MOVE',
        message: '【2】黄を選択',
        subMessage: '5番をタップ',
        selectSpot: 5,
        highlightSpots: [5],
    },
    {
        type: 'MOVE_TO',
        message: '青(4点)を飛び越えて獲得！',
        subMessage: '3番をタップ',
        targetSpot: 3,
        highlightSpots: [3],
        capturedSpot: 4,
        gainPoints: 4,
    },

    // Move 3
    {
        type: 'MOVE',
        message: '【3】青を選択',
        subMessage: '14番をタップ',
        selectSpot: 14,
        highlightSpots: [14],
    },
    {
        type: 'MOVE_TO',
        message: '青(4点)を飛び越えて獲得！',
        subMessage: '5番をタップ',
        targetSpot: 5,
        highlightSpots: [5],
        capturedSpot: 9,
        gainPoints: 4,
    },

    // Move 4
    {
        type: 'MOVE',
        message: '【4】白を選択',
        subMessage: '2番をタップ',
        selectSpot: 2,
        highlightSpots: [2],
    },
    {
        type: 'MOVE_TO',
        message: '青(4点)を飛び越えて獲得！',
        subMessage: '9番をタップ',
        targetSpot: 9,
        highlightSpots: [9],
        capturedSpot: 5,
        gainPoints: 4,
    },

    // Move 5
    {
        type: 'MOVE',
        message: '【5】赤を選択',
        subMessage: '12番をタップ',
        selectSpot: 12,
        highlightSpots: [12],
    },
    {
        type: 'MOVE_TO',
        message: '緑(3点)を獲得！',
        subMessage: '5番をタップ',
        targetSpot: 5,
        highlightSpots: [5],
        capturedSpot: 8,
        gainPoints: 3,
    },

    // Move 6
    {
        type: 'MOVE',
        message: '【6】黄を選択',
        subMessage: '10番をタップ',
        selectSpot: 10,
        highlightSpots: [10],
    },
    {
        type: 'MOVE_TO',
        message: '白(5点)を飛び越えて獲得！大きい！',
        subMessage: '12番をタップ',
        targetSpot: 12,
        highlightSpots: [12],
        capturedSpot: 11,
        gainPoints: 5,
    },

    // Move 7
    {
        type: 'MOVE',
        message: '【7】緑を選択',
        subMessage: '13番をタップ',
        selectSpot: 13,
        highlightSpots: [13],
    },
    {
        type: 'MOVE_TO',
        message: '黄(2点)を獲得',
        subMessage: '11番をタップ',
        targetSpot: 11,
        highlightSpots: [11],
        capturedSpot: 12,
        gainPoints: 2,
    },

    // Move 8
    {
        type: 'MOVE',
        message: '【8】緑を選択（赤を取って連続ターン）',
        subMessage: '11番をタップ',
        selectSpot: 11,
        highlightSpots: [11],
    },
    {
        type: 'MOVE_TO',
        message: '赤(1点)を獲得。連続ターンです。',
        subMessage: '4番をタップ',
        targetSpot: 4,
        highlightSpots: [4],
        capturedSpot: 7,
        gainPoints: 1,
    },

    // Move 9
    {
        type: 'MOVE',
        message: '【9】連続ターン中',
        subMessage: '9番をタップ',
        selectSpot: 9,
        highlightSpots: [9],
    },
    {
        type: 'MOVE_TO',
        message: '赤(1点)を獲得。さらに連続ターン。',
        subMessage: '2番をタップ',
        targetSpot: 2,
        highlightSpots: [2],
        capturedSpot: 5,
        gainPoints: 1,
    },

    // Move 10
    {
        type: 'MOVE',
        message: '【10】白を選択',
        subMessage: '6番をタップ',
        selectSpot: 6,
        highlightSpots: [6],
    },
    {
        type: 'MOVE_TO',
        message: '黄(2点)を獲得',
        subMessage: '1番をタップ',
        targetSpot: 1,
        highlightSpots: [1],
        capturedSpot: 3,
        gainPoints: 2,
    },

    // Move 11
    {
        type: 'MOVE',
        message: '【11】赤を選択',
        subMessage: '0番をタップ',
        selectSpot: 0,
        highlightSpots: [0],
    },
    {
        type: 'MOVE_TO',
        message: '白(5点)を獲得！',
        subMessage: '3番をタップ',
        targetSpot: 3,
        highlightSpots: [3],
        capturedSpot: 1,
        gainPoints: 5,
    },

    // Move 12
    {
        type: 'MOVE',
        message: '【12】あと少し！',
        subMessage: '3番をタップ',
        selectSpot: 3,
        highlightSpots: [3],
    },
    {
        type: 'MOVE_TO',
        message: '緑(3点)を獲得！',
        subMessage: '5番をタップ',
        targetSpot: 5,
        highlightSpots: [5],
        capturedSpot: 4,
        gainPoints: 3,
    },

    // Move 13
    {
        type: 'MOVE',
        message: '【13】最後のジャンプ！',
        subMessage: '5番をタップ',
        selectSpot: 5,
        highlightSpots: [5],
    },
    {
        type: 'MOVE_TO',
        message: '白(5点)を獲得！',
        subMessage: '0番をタップ',
        targetSpot: 0,
        highlightSpots: [0],
        capturedSpot: 2,
        gainPoints: 5,
    },

    {
        type: 'COMPLETE',
        message: '🎉 赤1個残し達成！\nチュートリアルクリアです！',
        subMessage: 'おめでとうございます',
        highlightSpots: [0],
        finalScore: 44,
    },
];

export const GUIDE_STYLES = {
    intro: {
        bgColor: 'from-blue-600/90 to-purple-600/90',
        borderColor: 'border-blue-400/50',
        icon: '🎮',
    },
    explain: {
        bgColor: 'from-gray-700/90 to-gray-800/90',
        borderColor: 'border-gray-500/50',
        icon: '📖',
    },
    action: {
        bgColor: 'from-emerald-600/90 to-teal-600/90',
        borderColor: 'border-emerald-400/50',
        icon: '👆',
    },
    success: {
        bgColor: 'from-yellow-600/90 to-orange-600/90',
        borderColor: 'border-yellow-400/50',
        icon: '🎉',
    },
};

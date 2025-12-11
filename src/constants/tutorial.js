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

export const TUTORIAL_STEPS = [
    {
        type: 'INTRO',
        message: 'TRYPASチュートリアル\n赤1個残しに挑戦！',
        subMessage: 'タップして次へ',
        highlightSpots: [],
    },
    {
        type: 'EXPLAIN',
        message: '赤を取ると連続ターン！\nでも最後に赤1個残すのが目標...',
        subMessage: '戦略的に進めましょう',
        highlightSpots: [],
    },

    // 初手: 0番(YELLOW)を取り除く = 20点
    {
        type: 'REMOVE',
        message: '【初手】黄(20点)を取り除く',
        subMessage: '低得点から始めます',
        targetSpot: 0,
        highlightSpots: [0],
    },

    // Move 1: 3→0 (1を飛び越え)
    // 取得: 1=GREEN=30点
    {
        type: 'MOVE',
        message: '【1】赤を選択',
        subMessage: '3番をタップ',
        selectSpot: 3,
        highlightSpots: [3],
    },
    {
        type: 'MOVE_TO',
        message: '緑(30点)を飛び越えて獲得！',
        subMessage: '0番をタップ',
        targetSpot: 0,
        highlightSpots: [0],
        capturedSpot: 1,
        gainPoints: 30,
    },

    // Move 2: 5→3 (4を飛び越え)
    // 取得: 4=BLUE=40点
    {
        type: 'MOVE',
        message: '【2】黄を選択',
        subMessage: '5番をタップ',
        selectSpot: 5,
        highlightSpots: [5],
    },
    {
        type: 'MOVE_TO',
        message: '青(40点)を飛び越えて獲得！',
        subMessage: '3番をタップ',
        targetSpot: 3,
        highlightSpots: [3],
        capturedSpot: 4,
        gainPoints: 40,
    },

    // Move 3: 14→5 (9を飛び越え)
    // 取得: 9=BLUE=40点
    {
        type: 'MOVE',
        message: '【3】青を選択',
        subMessage: '14番をタップ',
        selectSpot: 14,
        highlightSpots: [14],
    },
    {
        type: 'MOVE_TO',
        message: '青(40点)を飛び越えて獲得！',
        subMessage: '5番をタップ',
        targetSpot: 5,
        highlightSpots: [5],
        capturedSpot: 9,
        gainPoints: 40,
    },

    // Move 4: 2→9 (5を飛び越え)
    // 取得: 5=BLUE(14→5)=40点
    {
        type: 'MOVE',
        message: '【4】白を選択',
        subMessage: '2番をタップ',
        selectSpot: 2,
        highlightSpots: [2],
    },
    {
        type: 'MOVE_TO',
        message: '青(40点)を飛び越えて獲得！',
        subMessage: '9番をタップ',
        targetSpot: 9,
        highlightSpots: [9],
        capturedSpot: 5,
        gainPoints: 40,
    },

    // Move 5: 12→5 (8を飛び越え)
    // 取得: 8=GREEN=30点
    {
        type: 'MOVE',
        message: '【5】ここで赤を取ります...',
        subMessage: '12番をタップ',
        selectSpot: 12,
        highlightSpots: [12],
    },
    {
        type: 'MOVE_TO',
        message: '緑(30点)を獲得！',
        subMessage: '5番をタップ',
        targetSpot: 5,
        highlightSpots: [5],
        capturedSpot: 8,
        gainPoints: 30,
    },

    // Move 6: 10→12 (11を飛び越え)
    // 取得: 11=WHITE=50点
    {
        type: 'MOVE',
        message: '【6】黄を選択',
        subMessage: '10番をタップ',
        selectSpot: 10,
        highlightSpots: [10],
    },
    {
        type: 'MOVE_TO',
        message: '白(50点)を飛び越えて獲得！大きい！',
        subMessage: '12番をタップ',
        targetSpot: 12,
        highlightSpots: [12],
        capturedSpot: 11,
        gainPoints: 50,
    },

    // Move 7: 13→11 (12を飛び越え)
    // 取得: 12=YELLOW(10→12)=20点 低得点...
    {
        type: 'MOVE',
        message: '【7】緑を選択\n(ここは低得点...仕方ない)',
        subMessage: '13番をタップ',
        selectSpot: 13,
        highlightSpots: [13],
    },
    {
        type: 'MOVE_TO',
        message: '黄(20点)...低いけど進めます',
        subMessage: '11番をタップ',
        targetSpot: 11,
        highlightSpots: [11],
        capturedSpot: 12,
        gainPoints: 20,
    },

    // Move 8: 11→4 (7を飛び越え)
    // 取得: 7=RED=10点 + 連続ターン！
    {
        type: 'MOVE',
        message: '【8】赤を取ると連続ターン！\nでも10点だけ...',
        subMessage: '11番をタップ',
        selectSpot: 11,
        highlightSpots: [11],
    },
    {
        type: 'MOVE_TO',
        message: '赤(10点)獲得！連続ターン発動！',
        subMessage: '4番をタップ',
        targetSpot: 4,
        highlightSpots: [4],
        capturedSpot: 7,
        gainPoints: 10,
    },

    // Move 9: 9→2 (5を飛び越え)
    // 取得: 5=RED(12→5)=10点 + 連続ターン！
    {
        type: 'MOVE',
        message: '【9】連続ターン！また赤...',
        subMessage: '9番をタップ',
        selectSpot: 9,
        highlightSpots: [9],
    },
    {
        type: 'MOVE_TO',
        message: '赤(10点)！また連続ターン！',
        subMessage: '2番をタップ',
        targetSpot: 2,
        highlightSpots: [2],
        capturedSpot: 5,
        gainPoints: 10,
    },

    // Move 10: 6→1 (3を飛び越え)
    // 取得: 3=YELLOW(5→3)=20点
    {
        type: 'MOVE',
        message: '【10】白を選択',
        subMessage: '6番をタップ',
        selectSpot: 6,
        highlightSpots: [6],
    },
    {
        type: 'MOVE_TO',
        message: '黄(20点)を獲得',
        subMessage: '1番をタップ',
        targetSpot: 1,
        highlightSpots: [1],
        capturedSpot: 3,
        gainPoints: 20,
    },

    // Move 11: 0→3 (1を飛び越え)
    // 取得: 1=WHITE(6→1)=50点
    {
        type: 'MOVE',
        message: '【11】赤を選択',
        subMessage: '0番をタップ',
        selectSpot: 0,
        highlightSpots: [0],
    },
    {
        type: 'MOVE_TO',
        message: '白(50点)を獲得！',
        subMessage: '3番をタップ',
        targetSpot: 3,
        highlightSpots: [3],
        capturedSpot: 1,
        gainPoints: 50,
    },

    // Move 12: 3→5 (4を飛び越え)
    // 取得: 4=GREEN(11→4)=30点
    {
        type: 'MOVE',
        message: '【12】あと少し！',
        subMessage: '3番をタップ',
        selectSpot: 3,
        highlightSpots: [3],
    },
    {
        type: 'MOVE_TO',
        message: '緑(30点)を獲得！',
        subMessage: '5番をタップ',
        targetSpot: 5,
        highlightSpots: [5],
        capturedSpot: 4,
        gainPoints: 30,
    },

    // Move 13: 5→0 (2を飛び越え)
    // 取得: 2=WHITE(9→2)=50点
    {
        type: 'MOVE',
        message: '【13】最後のジャンプ！',
        subMessage: '5番をタップ',
        selectSpot: 5,
        highlightSpots: [5],
    },
    {
        type: 'MOVE_TO',
        message: '白(50点)を獲得！',
        subMessage: '0番をタップ',
        targetSpot: 0,
        highlightSpots: [0],
        capturedSpot: 2,
        gainPoints: 50,
    },

    {
        type: 'COMPLETE',
        message: '🎉 赤1個残し達成！\n苦戦したけどクリア！',
        subMessage: '赤を取るタイミングが重要でしたね',
        highlightSpots: [0],
        finalScore: 460,
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

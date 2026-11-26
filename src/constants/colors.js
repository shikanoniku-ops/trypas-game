export const PIECE_COLORS = {
    RED: '#FF6B6B',
    GREEN: '#2ECC71',
    BLUE: '#45B7D1',
    YELLOW: '#FFE66D',
    WHITE: '#F7FFF7',
};

export const PIECE_TYPES = ['RED', 'GREEN', 'BLUE', 'YELLOW', 'WHITE'];

// 取ったときの点数（2026-11-26 に10〜50点から1〜5点へ。コマの数字と同じ）
export const PIECE_SCORES = {
    RED: 1,
    YELLOW: 2,
    GREEN: 3,
    BLUE: 4,
    WHITE: 5,
};

// コマの真ん中に出す数字は点数と同じ（数字＝点数。点数表を1つにして、ずれないようにする）
export const PIECE_NUMBERS = PIECE_SCORES;

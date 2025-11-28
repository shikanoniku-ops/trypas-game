// Board Layout
//       0
//      1 2
//     3 4 5
//    6 7 8 9
// 10 11 12 13 14

export const BOARD_SIZE = 15;

export const SPOT_COORDINATES = [
    { x: 50, y: 10 },    // 0
    { x: 40, y: 30 }, { x: 60, y: 30 }, // 1, 2
    { x: 30, y: 50 }, { x: 50, y: 50 }, { x: 70, y: 50 }, // 3, 4, 5
    { x: 20, y: 70 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 70 }, // 6, 7, 8, 9
    { x: 10, y: 90 }, { x: 30, y: 90 }, { x: 50, y: 90 }, { x: 70, y: 90 }, { x: 90, y: 90 }, // 10, 11, 12, 13, 14
];

// All straight lines on the board (indices)
// Used to calculate valid jumps dynamically
export const BOARD_LINES = [
    // Horizontal
    [0], // Tip has no horizontal
    [1, 2],
    [3, 4, 5],
    [6, 7, 8, 9],
    [10, 11, 12, 13, 14],

    // Diagonal / (Top-Right to Bottom-Left)
    [0, 2, 5, 9, 14],
    [1, 4, 8, 13],
    [3, 7, 12],
    [6, 11],

    // Diagonal \ (Top-Left to Bottom-Right)
    [0, 1, 3, 6, 10],
    [2, 4, 7, 11],
    [5, 8, 12],
    [9, 13]
];

export const ADJACENCY = [
    // 0
    [1, 2],
    // 1
    [0, 3, 4, 2],
    // 2
    [0, 4, 5, 1],
    // 3
    [1, 6, 7, 4],
    // 4
    [1, 2, 3, 5, 7, 8],
    // 5
    [2, 4, 8, 9],
    // 6
    [3, 10, 11, 7],
    // 7
    [3, 4, 6, 8, 11, 12],
    // 8
    [4, 5, 7, 9, 12, 13],
    // 9
    [5, 8, 13, 14],
    // 10
    [6, 11],
    // 11
    [6, 7, 10, 12],
    // 12
    [7, 8, 11, 13],
    // 13
    [8, 9, 12, 14],
    // 14
    [9, 13]
];

import { useState, useCallback } from 'react';
import { TUTORIAL_INITIAL_BOARD, TUTORIAL_STEPS } from '../constants/tutorial';
import { PIECE_SCORES } from '../constants/colors';

/**
 * チュートリアルモード用のカスタムフック
 */
export const useTutorial = () => {
    const [isTutorialMode, setIsTutorialMode] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);
    const [board, setBoard] = useState([...TUTORIAL_INITIAL_BOARD]);
    const [score, setScore] = useState(0);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [showGuide, setShowGuide] = useState(true);

    // 現在のステップ情報
    const currentStepData = TUTORIAL_STEPS[tutorialStep] || null;

    // チュートリアル開始
    const startTutorial = useCallback(() => {
        setIsTutorialMode(true);
        setTutorialStep(0);
        setBoard([...TUTORIAL_INITIAL_BOARD]);
        setScore(0);
        setSelectedSpot(null);
        setIsComplete(false);
        setShowGuide(true);
    }, []);

    // チュートリアル終了
    const exitTutorial = useCallback(() => {
        setIsTutorialMode(false);
        setTutorialStep(0);
        setBoard([...TUTORIAL_INITIAL_BOARD]);
        setScore(0);
        setSelectedSpot(null);
        setIsComplete(false);
    }, []);

    // ガイドをクリックして次へ（INTRO, EXPLAIN, COMPLETE用）
    const advanceGuide = useCallback(() => {
        if (!currentStepData) return;

        if (currentStepData.type === 'INTRO' || currentStepData.type === 'EXPLAIN') {
            setTutorialStep(prev => prev + 1);
        } else if (currentStepData.type === 'COMPLETE') {
            setIsComplete(true);
        }
    }, [currentStepData]);

    // スポットクリックハンドラ
    const handleTutorialSpotClick = useCallback((index) => {
        if (!currentStepData || isComplete) return;

        const stepType = currentStepData.type;

        // REMOVE ステップ
        if (stepType === 'REMOVE') {
            if (index === currentStepData.targetSpot) {
                const newBoard = [...board];
                const removedColor = newBoard[index];
                const removedScore = PIECE_SCORES[removedColor];
                newBoard[index] = null;
                setBoard(newBoard);
                setScore(prev => prev + removedScore);
                setTutorialStep(prev => prev + 1);
            }
            return;
        }

        // MOVE ステップ（コマを選択）
        if (stepType === 'MOVE') {
            if (index === currentStepData.selectSpot) {
                setSelectedSpot(index);
                setTutorialStep(prev => prev + 1);
            }
            return;
        }

        // MOVE_TO ステップ（着地点を選択）
        if (stepType === 'MOVE_TO') {
            if (index === currentStepData.targetSpot && selectedSpot !== null) {
                const newBoard = [...board];
                const piece = newBoard[selectedSpot];

                // コマを移動
                newBoard[selectedSpot] = null;
                newBoard[index] = piece;

                // 飛び越えたコマを取得
                if (currentStepData.capturedSpot !== undefined) {
                    const capturedScore = PIECE_SCORES[newBoard[currentStepData.capturedSpot]];
                    newBoard[currentStepData.capturedSpot] = null;
                    setScore(prev => prev + (currentStepData.gainPoints || capturedScore));
                }

                setBoard(newBoard);
                setSelectedSpot(null);
                setTutorialStep(prev => prev + 1);
            }
            return;
        }
    }, [currentStepData, board, selectedSpot, isComplete]);

    // ハイライトすべきスポットかどうか
    const isHighlighted = useCallback((index) => {
        if (!currentStepData) return false;
        return currentStepData.highlightSpots?.includes(index) || false;
    }, [currentStepData]);

    // 有効な移動先かどうか（MOVE_TOステップ用）
    const isValidMoveTarget = useCallback((index) => {
        if (!currentStepData || currentStepData.type !== 'MOVE_TO') return false;
        return index === currentStepData.targetSpot;
    }, [currentStepData]);

    return {
        // 状態
        isTutorialMode,
        tutorialStep,
        totalSteps: TUTORIAL_STEPS.length,
        board,
        score,
        selectedSpot,
        isComplete,
        showGuide,
        currentStepData,

        // アクション
        startTutorial,
        exitTutorial,
        advanceGuide,
        handleTutorialSpotClick,
        setShowGuide,

        // ヘルパー
        isHighlighted,
        isValidMoveTarget,
    };
};

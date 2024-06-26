import React, { useState, useEffect } from 'react';
import Answers from './Answers';

const ReadingQuestionLayout = ({ questionsData, setQuestionsData }) => {
    const [localQuestionsData, setLocalQuestionsData] = useState([]);

    useEffect(() => {
        if (questionsData == null) {
            setLocalQuestionsData([
                {
                    question: "",
                    explanation: "",
                    answers: [
                        { answer: "", isCorrect: false },
                        { answer: "", isCorrect: false },
                        { answer: "", isCorrect: false },
                        { answer: "", isCorrect: false }
                    ],
                },
            ]);
        } else {
            setLocalQuestionsData(questionsData);
        }
    }, [questionsData]);

    const handleQuestionChange = (index, newQuestion) => {
        const updatedQuestionsData = [...localQuestionsData];
        updatedQuestionsData[index].question = newQuestion;
        setLocalQuestionsData(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    const handleExplanationChange = (index, newExplanation) => {
        const updatedQuestionsData = [...localQuestionsData];
        updatedQuestionsData[index].explanation = newExplanation;
        setLocalQuestionsData(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    const handleAnswerChange = (qIndex, aIndex, newAnswer) => {
        const updatedQuestionsData = [...localQuestionsData];
        updatedQuestionsData[qIndex].answers[aIndex] = newAnswer;
        setLocalQuestionsData(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            question: "",
            explanation: "",
            answers: [
                { answer: "", isCorrect: false },
                { answer: "", isCorrect: false },
                { answer: "", isCorrect: false },
                { answer: "", isCorrect: false }
            ],
        };
        const updatedQuestionsData = [...localQuestionsData, newQuestion];
        setLocalQuestionsData(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestionsData = localQuestionsData.filter((_, qIndex) => qIndex !== index);
        setLocalQuestionsData(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    return (
        <div>
            {localQuestionsData.map((questionData, qIndex) => (
                <div key={qIndex} className="mt-5">
                    <hr className='mb-5' />
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Câu hỏi
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi"
                            className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            value={questionData.question}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        />
                    </div>
                    <div className="mt-5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Đáp án
                        </label>
                        {questionData.answers.map((answer, aIndex) => (
                            <Answers
                                key={aIndex}
                                qIndex={qIndex}
                                index={aIndex}
                                answer={answer}
                                onAnswerChange={handleAnswerChange}
                            />
                        ))}
                    </div>
                    <div className="mt-5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Giải thích (nếu có)
                        </label>
                        <textarea
                            placeholder="Nhập giải thích"
                            className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            value={questionData.explanation}
                            onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="mt-5 px-4 py-2 text-white rounded-lg bg-red"
                        onClick={() => handleRemoveQuestion(qIndex)}
                    >
                        Xóa câu hỏi
                    </button>
                </div>
            ))}
            <button
                type="button"
                className="mt-5 px-4 py-2 bg-primary text-white rounded-lg"
                onClick={handleAddQuestion}
            >
                Thêm câu hỏi
            </button>
        </div>
    );
};

export default ReadingQuestionLayout;

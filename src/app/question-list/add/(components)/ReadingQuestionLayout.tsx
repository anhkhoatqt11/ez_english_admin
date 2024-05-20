import React, { useState } from 'react';
import Answers from './Answers';

const ReadingQuestionLayout = ({ setQuestion, setAnswers, setExplanation }) => {
    const [question, setQuestionState] = useState("");
    const [explanation, setExplanationState] = useState("");
    const [answers, setAnswersState] = useState([
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false }
    ]);

    const handleQuestionChange = (e) => {
        setQuestionState(e.target.value);
        setQuestion(e.target.value);
    };

    const handleExplanationChange = (e) => {
        setExplanationState(e.target.value);
        setExplanation(e.target.value);
    }

    const handleAnswerChange = (index, newAnswer) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = newAnswer;
        setAnswersState(updatedAnswers);
        setAnswers(updatedAnswers);
    };



    return (
        <div>
            <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Câu hỏi
                </label>
                <input
                    type="text"
                    placeholder="Nhập câu hỏi"
                    className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={question}
                    onChange={handleQuestionChange}
                />
            </div>
            <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Đáp án
                </label>
                {answers.map((answer, index) => (
                    <Answers
                        key={index}
                        index={index}
                        answer={answer}
                        onAnswerChange={handleAnswerChange}
                    />
                ))}
            </div>
            <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Giải thích (nếu có)
                </label>
                <textarea
                    placeholder="Nhập giải thích"
                    className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={explanation}
                    onChange={handleExplanationChange}
                />
            </div>
        </div>
    );
};

export default ReadingQuestionLayout;
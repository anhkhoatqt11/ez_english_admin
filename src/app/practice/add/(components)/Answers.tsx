import React from 'react';

const Answers = ({ qIndex, index, answer, onAnswerChange }) => {
    const handleAnswerTextChange = (e) => {
        const updatedAnswer = { ...answer, answer: e.target.value };
        onAnswerChange(qIndex, index, updatedAnswer);
    };

    const handleIsCorrectChange = (e) => {
        const updatedAnswer = { ...answer, isCorrect: e.target.checked };
        onAnswerChange(qIndex, index, updatedAnswer);
    };

    return (
        <div className="mt-2 flex items-center">
            <input
                type="text"
                placeholder="Nhập đáp án"
                className="w-full rounded-lg border border-stroke bg-white py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={answer.answer}
                onChange={handleAnswerTextChange}
            />
            <input
                type="checkbox"
                className="ml-3"
                checked={answer.isCorrect}
                onChange={handleIsCorrectChange}
            />
        </div>
    );
};

export default Answers;

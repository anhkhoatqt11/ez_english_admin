import React from 'react';

const Answers = ({ index, answer, onAnswerChange }) => {
    const handleTextChange = (e) => {
        onAnswerChange(index, { ...answer, answer: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        onAnswerChange(index, { ...answer, isCorrect: e.target.checked });
    };

    return (
        <>
            <div className='mt-5'>
                <input
                    type="text"
                    placeholder='Nhập câu trả lời'
                    className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={answer.answer}
                    onChange={handleTextChange}
                />
            </div>
            <div className='mt-3'>
                <label className="flex flex-col items-end">
                    <input
                        type="checkbox"
                        className="rounded border-stroke text-primary focus:ring-primary dark:border-form-strokedark dark:focus:ring-primary"
                        checked={answer.isCorrect}
                        onChange={handleCheckboxChange}
                    />
                    <span className="ml-2 text-sm font-medium text-black dark:text-white">
                        Đáp án đúng
                    </span>
                </label>
            </div>
        </>
    );
};

export default Answers;
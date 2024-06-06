import { FileDialog } from '@/components/FileDialog';
import React, { useState, useEffect } from 'react';

const WritingQuestionLayout = ({ questionsData, setQuestionsData, questionImageFile, setQuestionImageFile, defaultQuestionImageFile }) => {

    const handleQuestionChange = (index, newQuestion) => {
        const updatedQuestionsData = [...questionsData];
        updatedQuestionsData[index].question = newQuestion;
        setQuestionsData(updatedQuestionsData);
    };

    const handleExplanationChange = (index, newExplanation) => {
        const updatedQuestionsData = [...questionsData];
        updatedQuestionsData[index].explanation = newExplanation;
        setQuestionsData(updatedQuestionsData);
    };

    return (
        <div>
            {questionsData.map((questionData, qIndex) => (
                <div key={qIndex} className="mt-5">
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Nhập câu hỏi
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập đoạn văn bản"
                            className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            value={questionData.question}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        />
                    </div>
                    <div className='mt-5'>
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
                </div>
            ))}
            <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    File hình ảnh
                </label>
                <div className="w-1/3 h-41 border-1 rounded">
                    <img
                        src={
                            questionImageFile[0]?.preview ||
                            questionImageFile[0]?.url ||
                            defaultQuestionImageFile
                        }
                        alt={questionImageFile[0]?.name}
                        className={`h-[360px] w-full rounded-md object-cover object-center`}
                    />
                </div>
                <FileDialog
                    name="images"
                    maxFiles={1}
                    maxSize={1024 * 1024 * 4}
                    files={questionImageFile}
                    setFiles={setQuestionImageFile}
                    disabled={false}
                    className={`mt-2 p-0 px-6 text-black hover:text-black`}
                />
            </div>
        </div>
    );
};

export default WritingQuestionLayout;
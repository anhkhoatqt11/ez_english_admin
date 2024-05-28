import React, { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { FileDialog } from '@/components/FileDialog';
import { VideoDialog } from '@/components/ui/VideoDialog';

const ListeningQuestionLayout = ({ setQuestionsData, questionImageFile, setQuestionImageFile, questionAudioFile, setQuestionAudioFile }) => {
    const supabase = createClient();

    const [questionsData, setQuestionsDataState] = useState([
        {
            question: "",
            explanation: "",
            answers: [
                { answer: "A", isCorrect: false },
                { answer: "B", isCorrect: false },
                { answer: "C", isCorrect: false },
                { answer: "D", isCorrect: false }
            ],
        },
    ]);

    const handleQuestionChange = (index, newQuestion) => {
        const updatedQuestionsData = [...questionsData];
        updatedQuestionsData[index].question = newQuestion;
        setQuestionsDataState(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    const handleExplanationChange = (index, newExplanation) => {
        const updatedQuestionsData = [...questionsData];
        updatedQuestionsData[index].explanation = newExplanation;
        setQuestionsDataState(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    const handleCorrectAnswerChange = (qIndex, aIndex) => {
        const updatedQuestionsData = questionsData.map((question, questionIndex) => ({
            ...question,
            answers: question.answers.map((answer, answerIndex) => ({
                ...answer,
                isCorrect: questionIndex === qIndex && answerIndex === aIndex
            }))
        }));
        setQuestionsDataState(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            question: "",
            explanation: "",
            answers: [
                { answer: "A", isCorrect: false },
                { answer: "B", isCorrect: false },
                { answer: "C", isCorrect: false },
                { answer: "D", isCorrect: false }
            ],
        };
        setQuestionsDataState([...questionsData, newQuestion]);
        setQuestionsData([...questionsData, newQuestion]);
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestionsData = questionsData.filter((_, qIndex) => qIndex !== index);
        setQuestionsDataState(updatedQuestionsData);
        setQuestionsData(updatedQuestionsData);
    };

    return (
        <div>
            {questionsData.map((questionData, qIndex) => (
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
                            <div key={aIndex} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={answer.isCorrect}
                                    onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                                />
                                <label className="ml-2 text-sm font-medium text-black dark:text-white">
                                    {answer.answer}
                                </label>
                            </div>
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
                        className="mt-5 px-4 py-2 bg-red-500 text-white rounded-lg bg-red"
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

            <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    File hình ảnh
                </label>
                <div className="w-1/3 h-41 border-1 rounded">
                    {questionImageFile[0] != null && (
                        <img
                            src={
                                questionImageFile[0]?.preview ||
                                questionImageFile[0]?.url ||
                                questionImageFile
                            }
                            alt={questionImageFile[0]?.name}
                            className={`h-[360px] w-full rounded-md object-cover object-center`}
                        />
                    )}
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

            <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    File âm thanh
                </label>
                <audio src={questionAudioFile[0]?.preview || questionAudioFile[0]?.url || questionAudioFile} controls>
                </audio>
                <VideoDialog
                    name="audio"
                    maxFiles={1}
                    maxSize={1024 * 1024 * 4}
                    files={questionAudioFile}
                    setFiles={setQuestionAudioFile}
                    disabled={false}
                    className={`mt-2 p-0 px-6 text-black hover:text-black`}
                />
            </div>
        </div>
    )
}

export default ListeningQuestionLayout;
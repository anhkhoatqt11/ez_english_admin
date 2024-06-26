import { FileDialog } from '@/components/FileDialog'
import { VideoDialog } from '@/components/ui/VideoDialog'
import React, { useEffect, useState } from 'react'

const SpeakingQuestionLayout = ({ answerSpeaking, explanationSpeaking, setAnswerSpeaking, setExplanationSpeaking, questionImageFile, setQuestionImageFile, defaultQuestionImageFile }) => {

    const [answer, setAnswerState] = useState("");
    const [explanation, setExplanationState] = useState("");

    useEffect(() => {
        setAnswerState(answerSpeaking);
        setExplanationState(explanationSpeaking);
        setAnswerSpeaking(answerSpeaking);
        setExplanationSpeaking(explanationSpeaking);
    }, [])

    const handleQuestionChange = (e) => {
        setAnswerState(e.target.value);
        setAnswerSpeaking(e.target.value);
    };

    const handleExplanationChange = (e) => {
        setExplanationState(e.target.value);
        setExplanationSpeaking(e.target.value);
    }

    return (
        <div>
            <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Đoạn văn bản
                </label>
                <input
                    type="text"
                    placeholder="Nhập đoạn văn bản"
                    className="w-full rounded-lg border border-stroke bg-white py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={answer}
                    onChange={handleQuestionChange}
                />
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


            {/* <div className='mt-5'>
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
            </div> */}
        </div>
    )
}

export default SpeakingQuestionLayout
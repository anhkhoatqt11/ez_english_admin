import React, { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { FileDialog } from '@/components/FileDialog';
import { Button } from '@/components/ui/button';
import { VideoDialog } from '@/components/ui/VideoDialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';

const ListeningQuestionLayout = ({ setQuestion, setExplanation, setCorrectLetter, questionImageFile, setQuestionImageFile, questionAudioFile, setQuestionAudioFile }) => {
    const supabase = createClient();

    const [question, setQuestionState] = useState("");
    const [explanation, setExplanationState] = useState("");
    // const [questionImageFile, setQuestionImageFile] = React.useState([]);
    // const [questionAudioFile, setQuestionAudioFile] = React.useState([]);

    const handleQuestionChange = (e) => {
        setQuestionState(e.target.value);
        setQuestion(e.target.value);
    };

    const handleExplanationChange = (e) => {
        setExplanationState(e.target.value);
        setExplanation(e.target.value);
    }

    const handleAnswerChange = (e) => {
        setCorrectLetter(e);
        console.log(e);
    }


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
                <RadioGroup defaultValue="A" onValueChange={handleAnswerChange}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A" id="r1" />
                        <Label htmlFor="r1">A</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="B" id="r2" />
                        <Label htmlFor="r2">B</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="C" id="r3" />
                        <Label htmlFor="r3">C</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="D" id="r4" />
                        <Label htmlFor="r4">D</Label>
                    </div>
                </RadioGroup>
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




            {/* <div className='mt-5'>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Hình ảnh
                </label>
                <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                    fill="#3C50E0"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                    fill="#3C50E0"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                    fill="#3C50E0"
                                />
                            </svg>
                        </span>
                        <p>
                            <span className="text-primary">Click to upload</span> or
                            drag and drop
                        </p>
                        <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                        <p>(max, 800 X 800px)</p>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default ListeningQuestionLayout
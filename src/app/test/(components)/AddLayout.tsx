"use client";

import DropdownDefault from '@/components/Dropdowns/DropdownDefault';
import SelectGroupOne from '@/components/SelectGroup/SelectGroupOne';
import SelectGroupTwo from '@/components/SelectGroup/SelectGroupTwo';
import React from 'react'
// import SelectQuestionType from './SelectQuestionType';
// import ReadingQuestionLayout from './ReadingQuestionLayout';
import Link from 'next/link';
import { createClient } from "@/utils/supabase/client";
// import ListeningQuestionLayout from './ListeningQuestionLayout';
import Loader from '@/components/Loader';
import SelectPart from './SelectPart';
import toast, { Toaster } from 'react-hot-toast';
// import SpeakingQuestionLayout from './SpeakingQuestionLayout';
// import WritingQuestionLayout from './WritingQuestionLayout';
import SelectQuestionType from '@/app/practice/add/(components)/SelectQuestionType';
import { da } from 'date-fns/locale';
import ReadingQuestionLayout from '@/app/practice/add/(components)/ReadingQuestionLayout';
import ListeningQuestionLayout from '@/app/practice/add/(components)/ListeningQuestionLayout';
import WritingQuestionLayout from '@/app/practice/add/(components)/WritingQuestionLayout';
import SpeakingQuestionLayout from '@/app/practice/add/(components)/SpeakingQuestionLayout';


const AddLayout = ({ testId }) => {
    const supabase = createClient();
    const [questionType, setQuestionType] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [audioUrl, setAudioUrl] = React.useState('');
    const [partID, setPartID] = React.useState(0);

    const [questionsData, setQuestionsData] = React.useState([
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
    const [selectedTypeID, setSelectedTypeID] = React.useState(0);
    const [questionImageFile, setQuestionImageFile] = React.useState([]);
    const [questionAudioFile, setQuestionAudioFile] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const [answerSpeaking, setAnswerSpeaking] = React.useState('');
    const [explanationSpeaking, setExplanationSpeaking] = React.useState('');

    const uploadReadingQuestion = async () => {
        setIsLoading(true);

        console.log(questionsData);

        try {

            if (questionsData.length == 0) {
                toast.error('Vui lòng thêm câu hỏi trước khi tải lên');
                return;
            }

            // Transform the questionsData into the required format
            const formattedQuestionsData = questionsData.map((questionObj) => {
                const answers = questionObj.answers.map(answerObj => answerObj.answer);
                const correctAnswerIndex = questionObj.answers.findIndex(answer => answer.isCorrect);

                return {
                    question: questionObj.question,
                    explanation: questionObj.explanation,
                    answers: answers,
                    correct_answer: correctAnswerIndex
                };
            });

            // Prepare the data for the insert
            const dataToInsert = {
                test_id: testId,
                part_id: partID,
                question: formattedQuestionsData.map(q => q.question),
                answer: formattedQuestionsData.map(q => ({
                    answers: q.answers,
                    explanation: q.explanation,
                    correct_answer: q.correct_answer
                }))
            };

            // Insert the data into the questions table
            const { data, error } = await supabase
                .from('test_question')
                .insert(dataToInsert);

            if (error) {
                console.error('Error uploading reading question:', error);
                toast.error('Có lỗi xảy ra khi tạo câu hỏi');
            } else {
                console.log('Reading question uploaded successfully:', data);
                toast.success('Câu hỏi đã được tạo thành công');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const uploadListeningQuestion = async () => {
        try {
            setIsLoading(true);
            if (questionImageFile.length > 0) {
                const { error: imgUploadError } = await supabase.storage.from("question_image").upload('Listening_Test/' + questionImageFile[0].name, questionImageFile[0]);
                const { data: imgUrl } = await supabase.storage.from('question_image').getPublicUrl('Listening_Test/' + questionImageFile[0].name);
                setImageUrl(imgUrl.publicUrl);
            }

            if (questionAudioFile.length > 0) {
                const { error: audioUploadError } = await supabase.storage.from("audio").upload('Listening_Test/' + questionAudioFile[0].name, questionAudioFile[0]);
                const { data: audioUrl } = await supabase.storage.from('audio').getPublicUrl('Listening_Test/' + questionAudioFile[0].name);
                setAudioUrl(audioUrl.publicUrl);
            }

            if (questionsData.length == 0) {
                toast.error('Vui lòng thêm câu hỏi trước khi tải lên');
                return;
            }

            const formattedQuestionsData = questionsData.map((questionObj) => {
                const answers = questionObj.answers.map(answerObj => answerObj.answer);
                const correctAnswerIndex = questionObj.answers.findIndex(answer => answer.isCorrect);

                return {
                    question: questionObj.question,
                    explanation: questionObj.explanation,
                    answers: answers,
                    correct_answer: correctAnswerIndex
                };
            });

            const dataToInsert = {
                test_id: testId,
                part_id: partID,
                question: formattedQuestionsData.map(q => q.question),
                answer: formattedQuestionsData.map(q => ({
                    answers: [],
                    explanation: q.explanation,
                    correct_answer: q.correct_answer
                })),
                audioUrl: audioUrl,
                imageUrl: imageUrl,
            };

            // Insert the data into the questions table
            const { data, error } = await supabase
                .from('test_question')
                .insert(dataToInsert);

            if (error) {
                console.error('Error uploading listening question:', error);
                toast.error('Có lỗi xảy ra khi tạo câu hỏi');
            } else {
                console.log('Listening question uploaded successfully:', data);
                toast.success('Câu hỏi đã được tạo thành công');
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // const uploadSpeakingQuestion = async () => {
    //     setIsLoading(true);
    //     if (questionImageFile.length > 0) {
    //         const { error: imgUploadError } = await supabase.storage.from("question_image").upload('Speaking/' + questionImageFile[0].name, questionImageFile[0]);
    //         const { data: imgUrl } = await supabase.storage.from('question_image').getPublicUrl('Speaking/' + questionImageFile[0].name);
    //         setImageUrl(imgUrl.publicUrl);
    //     }

    //     if (questionAudioFile.length > 0) {
    //         const { error: audioUploadError } = await supabase.storage.from("audio").upload('Speaking/' + questionAudioFile[0].name, questionAudioFile[0]);
    //         const { data: audioUrl } = await supabase.storage.from('question_image').getPublicUrl('Speaking/' + questionAudioFile[0].name);
    //         setAudioUrl(audioUrl.publicUrl);
    //     }

    //     if (answerSpeaking.length == 0) {
    //         toast.error("Vui lòng nhập câu trả lời");
    //         return;
    //     }

    //     const dataToInsert = {
    //         skill_id: selectedTypeID,
    //         part_id: partID,
    //         answer: answerSpeaking,
    //         explanation: explanationSpeaking,
    //         audioUrl: audioUrl,
    //         imageUrl: imageUrl,
    //     };

    //     // Insert the data into the questions table
    //     const { data, error } = await supabase
    //         .from('speaking_question')
    //         .insert(dataToInsert);

    //     if (error) {
    //         console.error('Error uploading speaking question:', error);
    //         toast.error('Có lỗi xảy ra khi tạo câu hỏi');
    //     } else {
    //         console.log('Speaking question uploaded successfully:', data);
    //         toast.success('Câu hỏi đã được tạo thành công');
    //     }
    //     setIsLoading(false);
    // }

    const uploadWritingQuestion = async () => {
        try {
            setIsLoading(true);
            let imageUrl = null;
            let audioUrl = null;

            if (questionImageFile.length > 0) {
                const { error: imgUploadError } = await supabase.storage.from("question_image").upload('Writing/' + questionImageFile[0].name, questionImageFile[0]);
                if (imgUploadError) {
                    throw imgUploadError;
                }
                const { data: imgUrlData } = await supabase.storage.from('question_image').getPublicUrl('Writing/' + questionImageFile[0].name);
                imageUrl = imgUrlData.publicUrl;
                setImageUrl(imageUrl);
            }

            if (questionAudioFile.length > 0) {
                const { error: audioUploadError } = await supabase.storage.from("audio").upload('Writing/' + questionAudioFile[0].name, questionAudioFile[0]);
                if (audioUploadError) {
                    throw audioUploadError;
                }
                const { data: audioUrlData } = await supabase.storage.from('audio').getPublicUrl('Writing/' + questionAudioFile[0].name);
                audioUrl = audioUrlData.publicUrl;
                setAudioUrl(audioUrl);
            }

            if (questionsData.length == 0) {
                toast.error('Vui lòng thêm câu hỏi trước khi tải lên');
                return;
            }

            const formattedQuestionsData = questionsData.map((questionObj) => {
                const answers = questionObj.answers.map(answerObj => answerObj.answer);
                const correctAnswerIndex = questionObj.answers.findIndex(answer => answer.isCorrect);

                return {
                    question: questionObj.question,
                    explanation: questionObj.explanation,
                    answers: answers,
                    correct_answer: correctAnswerIndex
                };
            });

            const dataToInsert = {
                skill_id: selectedTypeID,
                part_id: partID,
                questions: formattedQuestionsData.map(q => q.question),
                answers: formattedQuestionsData.map(q => ({
                    answers: q.answers,
                    explanation: q.explanation,
                    correct_answer: q.correct_answer
                })),
                audiourl: audioUrl,
                imageurl: imageUrl,
            };

            console.log(dataToInsert);

            const { data, error } = await supabase
                .from('test_question')
                .insert(dataToInsert);

            if (error) {
                console.error('Error uploading listening question:', error);
                toast.error('Có lỗi xảy ra khi tạo câu hỏi');
            } else {
                console.log('Listening question uploaded successfully:', data);
                toast.success('Câu hỏi đã được tạo thành công');
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi tạo câu hỏi');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <Toaster />
            {isLoading ? (
                <div className='flex h-screen items-center justify-center'>
                    <Loader />
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-semibold text-black dark:text-white">Tạo câu hỏi</h1>
                    <SelectQuestionType setQuestionType={setQuestionType} setSelectedTypeID={setSelectedTypeID} selectedTypeID={null} />
                    {questionType === 'Reading' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={null} />
                            <ReadingQuestionLayout
                                setQuestionsData={setQuestionsData}
                                questionsData={null}
                            />
                            <Link
                                href="#"
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    uploadReadingQuestion();
                                }}
                            >
                                Tạo câu hỏi
                            </Link>
                        </div>
                    )}

                    {questionType == 'Listening' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={null} />
                            <ListeningQuestionLayout
                                setQuestionsData={setQuestionsData}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                                questionAudioFile={questionAudioFile}
                                setQuestionAudioFile={setQuestionAudioFile}
                                defaultAudioQuestionFile={null}
                                defaultQuestionImageFile={null}
                                initialQuestionsData={null}
                            />
                            <Link
                                href="#"
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    uploadListeningQuestion();
                                }}
                            >
                                Tạo câu hỏi
                            </Link>
                        </div>
                    )}


                    {questionType == 'Speaking' && (
                        <div>
                            {/* <SelectPart questionType={questionType} setPartID={setPartID} partID={null} />
                            <SpeakingQuestionLayout
                                setAnswerSpeaking={setAnswerSpeaking}
                                setExplanationSpeaking={setExplanationSpeaking}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                            />
                            <Link
                                href="#"
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    uploadSpeakingQuestion();
                                }}
                            >
                                Tạo câu hỏi
                            </Link> */}
                            <h1>Thi thử không hỗ trợ kỹ năng Nói</h1>
                        </div>
                    )}

                    {questionType == 'Writing' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={null} />
                            <WritingQuestionLayout
                                questionsData={null}
                                setQuestionsData={setQuestionsData}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                            />
                            <Link
                                href="#"
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    uploadWritingQuestion();
                                }}
                            >
                                Tạo câu hỏi
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default AddLayout;

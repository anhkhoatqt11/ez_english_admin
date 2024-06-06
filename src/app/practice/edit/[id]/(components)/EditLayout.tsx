"use client";

import ReadingQuestionLayout from '@/app/practice/add/(components)/ReadingQuestionLayout';
import SelectPart from '@/app/practice/add/(components)/SelectPart';
import SelectQuestionType from '@/app/practice/add/(components)/SelectQuestionType';
import ListeningQuestionLayout from '@/app/practice/add/(components)/ListeningQuestionLayout';
import SpeakingQuestionLayout from '@/app/practice/add/(components)/SpeakingQuestionLayout';
import WritingQuestionLayout from '@/app/practice/add/(components)/WritingQuestionLayout';
import Loader from '@/components/Loader';
import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';


const EditLayout = ({ id }) => {
    const supabase = createClient();

    const [questionType, setQuestionType] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [partID, setPartID] = useState(0);
    const [questionsData, setQuestionsData] = useState([]);
    const [selectedTypeID, setSelectedTypeID] = useState(0);
    const [questionImageFile, setQuestionImageFile] = useState([]);
    const [questionAudioFile, setQuestionAudioFile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [defaultQuestionImageFile, setDefaultQuestionImageFile] = useState();
    const [defaultAudioQuestionFile, setDefaultAudioQuestionFile] = useState();

    const [answerSpeaking, setAnswerSpeaking] = useState('');
    const [explanationSpeaking, setExplanationSpeaking] = useState('');

    useEffect(() => {
        const fetchQuestion = async () => {
            const { data, error } = await supabase
                .from('question')
                .select('*')
                .eq('question_id', id)
                .single();

            if (error) {
                console.error('Error fetching question:', error);
                toast.error('Có lỗi xảy ra khi lấy dữ liệu câu hỏi');
            } else {
                const { questions, answers, imageurl, audiourl, test_id, part_id } = data;
                setQuestionsData(questions.map((q, index) => ({
                    question: q,
                    explanation: answers[index].explanation,
                    answers: answers[index].answers.map((answer, i) => ({
                        answer,
                        isCorrect: i === answers[index].correct_answer
                    }))
                })));
                setImageUrl(imageurl);
                setAudioUrl(audiourl);
                setDefaultQuestionImageFile(imageurl);
                setDefaultAudioQuestionFile(audiourl);
                setSelectedTypeID(test_id);
                setPartID(part_id);
                setQuestionType(test_id === 1 ? 'Reading' : test_id === 2 ? 'Listening' : test_id === 3 ? 'Speaking' : 'Writing');
            }
            setIsLoading(false);
        };

        fetchQuestion();
    }, [id, supabase]);

    const updateQuestion = async () => {
        setIsLoading(true);

        try {
            // Upload new image if any
            if (questionImageFile.length > 0) {
                const { error: imgUploadError } = await supabase.storage.from("question_image").upload(questionType + '/' + questionImageFile[0].name, questionImageFile[0]);
                const { data: imgUrl } = await supabase.storage.from('question_image').getPublicUrl(questionType + '/' + questionImageFile[0].name);
                setImageUrl(imgUrl.publicUrl);
            }

            // Upload new audio if any
            if (questionAudioFile.length > 0) {
                const { error: audioUploadError } = await supabase.storage.from("audio").upload(questionType + '/' + questionAudioFile[0].name, questionAudioFile[0]);
                const { data: audioUrl } = await supabase.storage.from('audio').getPublicUrl(questionType + '/' + questionAudioFile[0].name);
                setAudioUrl(audioUrl.publicUrl);
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

            const dataToUpdate = {
                test_id: selectedTypeID,
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

            const { data, error } = await supabase
                .from('question')
                .update(dataToUpdate)
                .eq('question_id', id);

            if (error) {
                console.error('Error updating question:', error);
                toast.error('Có lỗi xảy ra khi cập nhật câu hỏi');
            } else {
                console.log('Question updated successfully:', data);
                toast.success('Câu hỏi đã được cập nhật thành công');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi cập nhật câu hỏi');
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
                    <SelectQuestionType setQuestionType={setQuestionType} setSelectedTypeID={setSelectedTypeID} selectedTypeID={selectedTypeID} />
                    {questionType === 'Reading' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={partID} />
                            <ReadingQuestionLayout
                                setQuestionsData={setQuestionsData}
                                questionsData={questionsData}
                            />
                            <button
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    updateQuestion();
                                }}
                            >
                                Cập nhật câu hỏi
                            </button>
                        </div>
                    )}

                    {questionType == 'Listening' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={partID} />
                            <ListeningQuestionLayout
                                setQuestionsData={setQuestionsData}
                                initialQuestionsData={questionsData}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                                questionAudioFile={questionAudioFile}
                                setQuestionAudioFile={setQuestionAudioFile}
                                defaultQuestionImageFile={defaultQuestionImageFile}
                                defaultAudioQuestionFile={defaultAudioQuestionFile}
                            />
                            <button
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    updateQuestion();
                                }}
                            >
                                Cập nhật câu hỏi
                            </button>
                        </div>
                    )}

                    {questionType == 'Writing' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={partID} />
                            <WritingQuestionLayout
                                setQuestionsData={setQuestionsData}
                                questionsData={questionsData}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                                defaultQuestionImageFile={defaultQuestionImageFile}
                            />
                            <button
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    updateQuestion();
                                }}
                            >
                                Cập nhật câu hỏi
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EditLayout;

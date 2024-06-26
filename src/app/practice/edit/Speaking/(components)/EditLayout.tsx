"use client";

// import ReadingQuestionLayout from '@/app/practice/add/(components)/ReadingQuestionLayout';
// import SelectPart from '@/app/practice/add/(components)/SelectPart';
// import SelectQuestionType from '@/app/practice/add/(components)/SelectQuestionType';
// import ListeningQuestionLayout from '@/app/practice/add/(components)/ListeningQuestionLayout';
// import SpeakingQuestionLayout from '@/app/practice/add/(components)/SpeakingQuestionLayout';
// import WritingQuestionLayout from '@/app/practice/add/(components)/WritingQuestionLayout';
import SpeakingQuestionLayout from '@/app/practice/add/(components)/SpeakingQuestionLayout';
import SelectPart from '@/app/practice/add/(components)/SelectPart';
import SelectQuestionType from '@/app/practice/add/(components)/SelectQuestionType';
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
                .from('speaking_question')
                .select('*')
                .eq('question_id', id)
                .single();

            if (error) {
                console.error('Error fetching question:', error);
                toast.error('Có lỗi xảy ra khi lấy dữ liệu câu hỏi');
            } else {
                const { answer, imageUrl, audiourl, explanation, skill_id, part_id } = data;
                setImageUrl(imageUrl);
                setAudioUrl(audiourl);
                setAnswerSpeaking(answer);
                setExplanationSpeaking(explanation);
                setDefaultQuestionImageFile(imageUrl);
                setDefaultAudioQuestionFile(audiourl);
                setSelectedTypeID(skill_id);
                setPartID(part_id);
                setQuestionType(skill_id === 1 ? 'Reading' : skill_id === 2 ? 'Listening' : skill_id === 3 ? 'Speaking' : 'Writing');
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
                const { error: imgUploadError } = await supabase.storage.from("question_image").upload('Speaking/' + questionImageFile[0].name, questionImageFile[0]);
                const { data: imgUrl } = await supabase.storage.from('question_image').getPublicUrl('Speaking/' + questionImageFile[0].name);
                setImageUrl(imgUrl.publicUrl);
            }

            // Upload new audio if any
            if (questionAudioFile.length > 0) {
                const { error: audioUploadError } = await supabase.storage.from("audio").upload('Speaking/' + questionAudioFile[0].name, questionAudioFile[0]);
                const { data: audioUrl } = await supabase.storage.from('audio').getPublicUrl('Speaking/' + questionAudioFile[0].name);
                setAudioUrl(audioUrl.publicUrl);
            }

            const dataToUpdate = {
                skill_id: selectedTypeID,
                part_id: partID,
                answer: answerSpeaking,
                explanation: explanationSpeaking,
                audioUrl: audioUrl,
                imageUrl: imageUrl,
            };

            const { data, error } = await supabase
                .from('speaking_question')
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
                    {/* {questionType === 'Reading' && (
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
                    )} */}

                    {/* {questionType == 'Listening' && (
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
                    )} */}

                    {questionType == 'Speaking' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={partID} />
                            <SpeakingQuestionLayout
                                setAnswerSpeaking={setAnswerSpeaking}
                                setExplanationSpeaking={setExplanationSpeaking}
                                answerSpeaking={answerSpeaking}
                                explanationSpeaking={explanationSpeaking}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                                questionAudioFile={questionAudioFile}
                                setQuestionAudioFile={setQuestionAudioFile}
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

                    {/* {questionType == 'Writing' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} partID={partID} />
                            <WritingQuestionLayout
                                setQuestionsData={setQuestionsData}
                                questionsData={questionsData}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
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
                    )} */}
                </>
            )}
        </div>
    );
};

export default EditLayout;

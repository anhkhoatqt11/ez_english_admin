"use client";

import DropdownDefault from '@/components/Dropdowns/DropdownDefault';
import SelectGroupOne from '@/components/SelectGroup/SelectGroupOne';
import SelectGroupTwo from '@/components/SelectGroup/SelectGroupTwo';
import React from 'react'
import SelectQuestionType from './SelectQuestionType';
import ReadingQuestionLayout from './ReadingQuestionLayout';
import Link from 'next/link';
import { createClient } from "@/utils/supabase/client";
import ListeningQuestionLayout from './ListeningQuestionLayout';
import Loader from '@/components/Loader';
import SelectPart from './SelectPart';

const AddLayout = () => {
    const supabase = createClient();
    const [questionType, setQuestionType] = React.useState('');
    const [question, setQuestion] = React.useState([]);
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

    const [explanation, setExplanation] = React.useState([]);
    const [selectedTypeID, setSelectedTypeID] = React.useState(0);
    const [questionImageFile, setQuestionImageFile] = React.useState([]);
    const [questionAudioFile, setQuestionAudioFile] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const uploadReadingQuestion = async () => {
        setIsLoading(true);

        console.log(questionsData);

        try {
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
                test_id: selectedTypeID,
                part_id: partID,
                questions: formattedQuestionsData.map(q => q.question),
                answers: formattedQuestionsData.map(q => ({
                    answers: q.answers,
                    explanation: q.explanation,
                    correct_answer: q.correct_answer
                }))
            };

            // Insert the data into the questions table
            const { data, error } = await supabase
                .from('question')
                .insert(dataToInsert);

            if (error) {
                console.error('Error uploading reading question:', error);
            } else {
                console.log('Reading question uploaded successfully:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const uploadListeningQuestion = async () => {

        try {
            const { error: imgUploadError } = await supabase.storage.from("question_image").upload('Listening/' + questionImageFile[0].name, questionImageFile[0]);
            const { data: imgUrl } = supabase.storage.from('question_image').getPublicUrl('Listening/' + questionImageFile[0].name);
            setImageUrl(imgUrl.publicUrl);

            const { error: audioUploadError } = await supabase.storage.from("audio").upload('Listening/' + questionAudioFile[0].name, questionAudioFile[0]);
            const { data: audioUrl } = supabase.storage.from('question_image').getPublicUrl('Listening/' + questionAudioFile[0].name);
            setAudioUrl(audioUrl.publicUrl);

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
                test_id: selectedTypeID,
                part_id: partID,
                questions: formattedQuestionsData.map(q => q.question),
                answers: formattedQuestionsData.map(q => ({
                    answers: [],
                    explanation: q.explanation,
                    correct_answer: q.correct_answer
                })),
                audiourl: extractLink(audioUrl),
                imageurl: extractLink(imageUrl),
            };

            // Insert the data into the questions table
            const { data, error } = await supabase
                .from('question')
                .insert(dataToInsert);

            if (error) {
                console.error('Error uploading listening question:', error);
            } else {
                console.log('Listening question uploaded successfully:', data);
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };


    function extractLink(jsonObj) {
        // Check if the provided object has a property named 'publicUrl'
        if (jsonObj && jsonObj.publicUrl) {
            // Return the value of 'publicUrl'
            return jsonObj.publicUrl;
        } else {
            // If 'publicUrl' is not found, return an appropriate message or handle the error
            return "Link not found";
        }
    }




    return (
        <div>
            {isLoading ? (
                <div className='flex h-screen items-center justify-center'>
                    <Loader />
                </div>
            ) : (
                <>                <SelectQuestionType setQuestionType={setQuestionType} setSelectedTypeID={setSelectedTypeID} />
                    {questionType === 'Reading' && (
                        <div>
                            <SelectPart questionType={questionType} setPartID={setPartID} />
                            <ReadingQuestionLayout
                                setQuestionsData={setQuestionsData}
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
                            <SelectPart questionType={questionType} setPartID={setPartID} />
                            <ListeningQuestionLayout
                                setQuestionsData={setQuestionsData}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                                questionAudioFile={questionAudioFile}
                                setQuestionAudioFile={setQuestionAudioFile}
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
                </>
            )}
        </div>
    )
}

export default AddLayout;

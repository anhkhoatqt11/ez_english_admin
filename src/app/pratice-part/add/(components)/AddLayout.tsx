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

const AddLayout = () => {
    const supabase = createClient();
    const [questionType, setQuestionType] = React.useState('');
    const [question, setQuestion] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [audioUrl, setAudioUrl] = React.useState('');
    const [answers, setAnswers] = React.useState([
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false },
        { answer: "", isCorrect: false }
    ]);
    const [explanation, setExplanation] = React.useState('');
    const [correctLetter, setCorrectLetter] = React.useState('A');
    const [selectedTypeID, setSelectedTypeID] = React.useState(0);
    const [questionImageFile, setQuestionImageFile] = React.useState([]);
    const [questionAudioFile, setQuestionAudioFile] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    function printQuestionAndAnswer() {
        console.log(question);
        console.log(answers);
    }

    const uploadReadingQuestion = async () => {
        setIsLoading(true);
        const correctIndex = answers.findIndex(answer => answer.isCorrect);
        const correctLetter = String.fromCharCode(65 + correctIndex); // 'A' is 65 in ASCII
        const { data: questionData, error: questionError } = await supabase
            .from('question')
            .insert({
                title: question,
                correct_letter: correctLetter,
                explanation: explanation,
                test_id: selectedTypeID,
            })
            .select('question_id')
            .single();

        if (questionError) {
            console.error("Error inserting question:", questionError);
            return;
        }

        const questionId = questionData.question_id;

        const choices = answers.map((answer, index) => ({
            letter: String.fromCharCode(65 + index), // 'A', 'B', 'C', 'D'
            content: answer.answer,
            question_id: questionId
        }));

        const { error: choicesError } = await supabase
            .from('choice')
            .insert(choices);

        if (choicesError) {
            console.error("Error inserting choices:", choicesError);
        } else {
            console.log("Choices inserted successfully");
        }
        setIsLoading(false);
    }

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


    const uploadListeningQuestion = async () => {
        setIsLoading(true);
        const { error: imgUploadError } = await supabase.storage.from("question_image").upload('Listening/' + questionImageFile[0].name, questionImageFile[0]);
        const { data: imgUrl } = supabase.storage.from('question_image').getPublicUrl('Listening/' + questionImageFile[0].name);
        setImageUrl(imgUrl.publicUrl);

        const { error: audioUploadError } = await supabase.storage.from("audio").upload('Listening/' + questionAudioFile[0].name, questionAudioFile[0]);
        const { data: audioUrl } = supabase.storage.from('question_image').getPublicUrl('Listening/' + questionAudioFile[0].name);
        setAudioUrl(audioUrl.publicUrl);
        const { data: questionData, error: questionError } = await supabase
            .from('question')
            .insert({
                title: question,
                correct_letter: correctLetter,
                explanation: explanation,
                test_id: selectedTypeID,
                audiourl: extractLink(audioUrl),
                imageurl: extractLink(imageUrl),
            })
            .select('question_id')
            .single();

        if (questionError) {
            console.error("Error inserting question:", questionError);
            return;
        }
        setIsLoading(false);
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
                            <ReadingQuestionLayout
                                setQuestion={setQuestion}
                                setAnswers={setAnswers}
                                setExplanation={setExplanation}
                            />
                            <Link
                                href="#"
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    printQuestionAndAnswer();
                                    uploadReadingQuestion();

                                }}
                            >
                                Tạo câu hỏi
                            </Link>
                        </div>
                    )}

                    {questionType == 'Listening' && (
                        <div>
                            <ListeningQuestionLayout
                                setQuestion={setQuestion}
                                setExplanation={setExplanation}
                                setCorrectLetter={setCorrectLetter}
                                questionImageFile={questionImageFile}
                                setQuestionImageFile={setQuestionImageFile}
                                questionAudioFile={questionAudioFile}
                                setQuestionAudioFile={setQuestionAudioFile}
                            />
                            <Link
                                href="#"
                                className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                onClick={() => {
                                    printQuestionAndAnswer();
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

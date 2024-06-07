"use client";

import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { createClient } from "@/utils/supabase/client";

const TestQuestionList = ({ categoryId, testId }) => {
    const [questions, setQuestions] = useState([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data: questionData, error: questionError } = await supabase
                .from('test_question')
                .select('*')
                .eq('test_id', testId)
                .order('id', { ascending: true });

            // const { data: speakingData, error: speakingError } = await supabase
            //     .from('test_question')
            //     .select('*')
            //     .eq('test_id', testId)
            //     .order('question_id', { ascending: true });

            if (questionError) {
                console.error(questionError);
                // } else if (speakingError) {
                //     console.error(speakingError);
            } else {
                const combinedData = [
                    ...questionData.map(q => ({ ...q, type: 'normal' })),
                    // ...speakingData.map(q => ({ ...q, type: 'speaking' }))
                ];
                setQuestions(combinedData);
            }
        };

        fetchQuestions();
    }, [testId]);

    function handleDisplayAnswer(answer) {
        switch (answer) {
            case 0:
                return "A";
            case 1:
                return "B";
            case 2:
                return "C";
            case 3:
                return "D";
            default:
                return "Không có";
        }
    }

    return (
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className="px-4 py-6 md:px-6 xl:px-7.5 flex flex-row justify-between">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Danh sách câu hỏi
                </h4>
                <div>
                    <Button
                        onClick={() => { router.push(`${testId}/add`) }}
                        className='text-white bg-green-500 font-bold hover:bg-black'
                    >
                        Tạo câu hỏi mới
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Câu hỏi</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Đáp án</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Hình ảnh</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Âm thanh</p>
                </div>
                <div className="col-span-1 flex items-center ml-2">
                    <p className="font-medium">Hành động</p>
                </div>
            </div>
            {questions.length === 0 && <p className='text-center py-4'>Không có câu hỏi nào</p>}
            {questions.map((question) => (
                <div key={question.question_id} className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    {/* <div className="col-span-1 flex items-center">
                        <p>{question.question_id}</p>
                    </div> */}
                    <div className="col-span-1 flex flex-col">
                        {question.type === 'normal' && question.question.map((q, index) => (
                            <div key={index} className='flex flex-col'>
                                <p className='font-bold'>Câu hỏi {index + 1}: {q}</p>
                            </div>
                        ))}
                        {question.type === 'speaking' && (
                            <div className='flex flex-col'>
                                <p>{question.question}</p>
                            </div>
                        )}
                    </div>
                    <div className="col-span-2 flex flex-col">
                        {question.type === 'normal' && question.answer.map((a, index) => (
                            <div key={index} className='flex flex-col'>
                                <p>Đáp án câu hỏi {index + 1}: {handleDisplayAnswer(a.correct_answer)}</p>
                                <p>Giải thích câu hỏi {index + 1}: {a.explanation == "" ? 'Không có' : a.explanation}</p>
                                <hr></hr>
                            </div>
                        ))}
                        {question.type === 'speaking' && (
                            <div className='flex flex-col'>
                                <p>Từ khoá: {question.answer}</p>
                                <p>Giải thích: {question.explanation}</p>
                            </div>
                        )}
                    </div>
                    <div className="col-span-2 flex items-center">
                        {question.type === 'normal' && question.imageUrl && <img src={question.imageUrl} alt="question" />}
                        {question.type === 'speaking' && question.imageUrl && <img src={question.imageUrl} alt="question" />}
                    </div>
                    <div className="col-span-1 flex items-center">
                        {question.type === 'normal' && question.audioUrl && <audio controls src={question.audioUrl} />}
                        {question.type === 'speaking' && question.audioUrl && <audio controls src={question.audioUrl} />}
                    </div>
                    <div className="col-span-1 flex items-center ml-2">
                        <Button className='text-white' onClick={() => {
                            if (question.type === 'normal') {
                                router.push(`${testId}/${question.id}/edit`)
                            } else {
                                router.push(`/practice/edit/Speaking/${question.question_id}`)
                            }
                        }}>Chỉnh sửa</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TestQuestionList;

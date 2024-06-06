"use client";

import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { createClient } from "@/utils/supabase/client";

const QuestionList = ({ partId, partName }) => {
    const [questions, setQuestions] = useState([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchQuestions = async () => {
            const { data: questionData, error: questionError } = await supabase
                .from('question')
                .select('*')
                .eq('part_id', partId)
                .order('question_id', { ascending: true });

            const { data: speakingData, error: speakingError } = await supabase
                .from('speaking_question')
                .select('*')
                .eq('part_id', partId)
                .order('question_id', { ascending: true });

            if (questionError) {
                console.error(questionError);
            } else if (speakingError) {
                console.error(speakingError);
            } else {
                const combinedData = [
                    ...questionData.map(q => ({ ...q, type: 'normal' })),
                    ...speakingData.map(q => ({ ...q, type: 'speaking' }))
                ];
                setQuestions(combinedData);
            }
        };

        fetchQuestions();
    }, [partId]);

    return (
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Danh sách câu hỏi của phần {partName}
                </h4>
                <p className="text-sm text-black dark:text-white">Truy cập các thông tin câu hỏi luyện tập</p>
            </div>
            <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Câu hỏi</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Đáp án</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Hình ảnh</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Âm thanh</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Sừa</p>
                </div>
            </div>
            {questions.map((question) => (
                <div key={question.question_id} className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-1 flex items-center">
                        <p>{question.question_id}</p>
                    </div>
                    <div className="col-span-2 flex flex-col">
                        {question.type === 'normal' && question.questions.map((q, index) => (
                            <p key={index}>{q}</p>
                        ))}
                        {question.type === 'speaking' && (
                            <p>{question.question}</p>
                        )}
                    </div>
                    <div className="col-span-2 flex flex-col">
                        {question.type === 'normal' && question.answers.map((a, index) => (
                            <div key={index}>
                                <p>Correct Answer: {a.correct_answer}</p>
                                <p>Explanation: {a.explanation}</p>
                            </div>
                        ))}
                        {question.type === 'speaking' && (
                            <div>
                                <p>Answer: {question.answer}</p>
                                <p>Explanation: {question.explanation}</p>
                            </div>
                        )}
                    </div>
                    <div className="col-span-1 flex items-center">
                        {question.type === 'normal' && question.imageurl && <img src={question.imageurl} alt="question" />}
                        {question.type === 'speaking' && question.imageUrl && <img src={question.imageUrl} alt="question" />}
                    </div>
                    <div className="col-span-1 flex items-center">
                        {question.type === 'normal' && question.audiourl && <audio controls src={question.audiourl} />}
                        {question.type === 'speaking' && question.audioUrl && <audio controls src={question.audioUrl} />}
                    </div>
                    <div className="col-span-1 flex items-center">
                        <Button className='text-white' onClick={() => {
                            if (question.type === 'normal') {
                                router.push(`/practice/edit/${question.question_id}`)
                            } else {
                                router.push(`/practice/edit/Speaking/${question.question_id}`)

                            }
                        }
                        }>Chỉnh sửa</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default QuestionList;

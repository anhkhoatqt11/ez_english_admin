import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface Question {
    question_id: number;
    questions: string[];
    answers: { [key: string]: string }[]; // Adjusted to reflect the possible structure of answers
    imageurl?: string | null;
    audiourl?: string | null;
    test_id: number;
    part_id: number | null;
}

const TableTwo = ({ questions }: { questions: Question[] }) => {
    //   const [questions, setQuestions] = useState<Question[]>([]);

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       const supabase = createClient();
    //       const { data, error } = await supabase.from<Question>("question").select();
    //       if (error) {
    //         console.error("Error fetching data:", error);
    //       } else {
    //         setQuestions(data || []);
    //       }
    //     };

    //     fetchData();
    //   }, []);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Question Lists
                </h4>
            </div>

            <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Question Title</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Correct Letter</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Image</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Audio</p>
                </div>
            </div>

            {questions.map((question, key) => (
                <div
                    className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                >
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{question.question_id}</p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <p className="text-sm text-black dark:text-white">{question.questions.join(' ')}</p>
                    </div>
                    {question.answers != null ? (
                        <div className="col-span-2 flex items-center">
                            <p className="text-sm text-black dark:text-white">{question.answers.map(answer => Object.values(answer).join(', ')).join(', ')}</p>
                        </div>
                    ) : (
                        <div className="col-span-2 flex items-center">
                            <p className="text-sm text-black dark:text-white">No Answer</p>
                        </div>
                    )}
                    <div className="col-span-1 flex items-center">
                        <div className="h-12.5 w-15 rounded-md">
                            {question.imageurl ? (
                                <img src={question.imageurl} width={60} height={50} alt="Question Image" />
                            ) : (
                                <p>No Image</p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-1 flex items-center">
                        {question.audiourl ? (
                            <audio controls>
                                <source src={question.audiourl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <p>No Audio</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableTwo;
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface Note {
    question_id: number;
    title: string;
    correct_letter: string;
    imageurl: string;
    audiourl: string;
    test_id: number;
    explanation: string | null;
    part_id: number;
}

const TableTwo = ({ notes }: { notes: Note[] }) => {
    //   const [notes, setNotes] = useState<Note[]>([]);

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       const supabase = createClient();
    //       const { data, error } = await supabase.from<Note>("question").select();
    //       if (error) {
    //         console.error("Error fetching data:", error);
    //       } else {
    //         setNotes(data || []);
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

            {notes.map((note, key) => (
                <div
                    className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                >
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{note.question_id}</p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <p className="text-sm text-black dark:text-white">{note.title}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="text-sm text-black dark:text-white">{note.correct_letter}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <div className="h-12.5 w-15 rounded-md">
                            {note.imageurl === null || note.imageurl === "" ? <p>No Image</p> : <img
                                src={note.imageurl}
                                width={60}
                                height={50}
                                alt="Image"
                            />}
                        </div>
                    </div>
                    <div className="col-span-1 flex items-center">
                        {note.audiourl === null || note.audiourl === "" ? <p>No Audio</p> :
                            <audio controls>
                                <source src={note.audiourl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>}

                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableTwo;
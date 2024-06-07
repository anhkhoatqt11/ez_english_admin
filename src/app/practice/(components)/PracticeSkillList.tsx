"use client";

import React from 'react';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Button } from '@nextui-org/react';

const PracticeSkillList = ({ part }) => {


    const router = useRouter();

    // Count the number of parts for each skill
    const skillCounts = part.reduce((acc, item) => {
        if (acc[item.skill]) {
            acc[item.skill]++;
        } else {
            acc[item.skill] = 1;
        }
        return acc;
    }, {});

    // Convert the skill counts to an array of objects for easy mapping
    const skillsArray = Object.entries(skillCounts).map(([skill, count]) => ({
        skill,
        count,
    }));


    return (
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            Các kỹ năng luyện tập
                        </h4>
                        <p className="text-sm text-black dark:text-white">Truy cập các thông tin câu hỏi luyện tập</p>
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                router.push(`/practice/add`);
                            }}
                            className='text-white bg-green-500 font-bold hover:bg-black'
                        >
                            Tạo câu hỏi
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Kỹ năng</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Số lượng phần</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Xem</p>
                </div>
            </div>
            {skillsArray.map((skill, index) => (
                <div key={index} className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm">{index + 1}</p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <p className="text-sm font-bold">{skill.skill}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="text-sm">{skill.count} phần</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <Button
                            onClick={() => {
                                router.push(`/practice/${skill.skill}`);
                            }}
                            className='text-white font-bold bg-blue-400'
                        >
                            Xem
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PracticeSkillList;
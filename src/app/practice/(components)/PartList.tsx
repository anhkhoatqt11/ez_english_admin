"use client";

import React from 'react';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';


const PartList = ({ partname, partlist }) => {
    const router = useRouter();
    console.log(partlist);
    return (
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Danh sách phần của kỹ năng {partname}
                </h4>
                <p className="text-sm text-black dark:text-white">Truy cập các thông tin câu hỏi luyện tập</p>
            </div>
            <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Tên phần</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Số lượng câu hỏi</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Xem</p>
                </div>
            </div>
            {partlist.map((part, index) => (
                <div key={index} className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm">{part.part_index}</p>
                    </div>
                    <div className="col-span-3 flex items-center">
                        <p className="text-sm">{part.part_name}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="text-sm">{part.question_count}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <Button
                            onClick={() => router.push(`/practice/${partname}/${part.id}`)}
                            className='text-white'
                        >
                            Xem
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PartList;
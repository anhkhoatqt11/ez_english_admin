"use client";

import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '@/components/Loader';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

const TestList = ({ id }) => {
    const [tests, setTests] = useState([]);
    const [levels, setLevels] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const [modalType, setModalType] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedId, setSelectedId] = useState('');
    const [testName, setTestName] = useState('');
    const [testDescription, setTestDescription] = useState('');
    const [testTime, setTestTime] = useState('');
    const [levelRequirement, setLevelRequirement] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchTests = async () => {
            const { data, error } = await supabase
                .from('test')
                .select(`
                    id,
                    name,
                    description,
                    level_requirement,
                    num_of_questions,
                    category_id,
                    time,
                    level:level_requirement (
                        level_name
                    ),
                    test_category:category_id (
                        name
                    )
                `)
                .eq('category_id', id);

            if (error) {
                console.error("Error fetching tests:", error);
                setError(error);
            } else {
                setTests(data);
                setIsLoading(false);
            }
        };

        const fetchLevels = async () => {
            const { data, error } = await supabase
                .from('level')
                .select(`
                    level_id,
                    level_name
                `);

            if (error) {
                console.error("Error fetching levels:", error);
                setError(error);
            } else {
                setLevels(data);
            }
        };

        fetchTests();
        fetchLevels();
    }, [id]);

    async function handleOpenModal(type, id) {
        setModalType(type);
        if (id > 0) {
            const { data: test_info } = await supabase.from('test').select(`
                id,
                name,
                description,
                level_requirement,
                num_of_questions,
                category_id,
                time,
                level:level_requirement (
                    level_name
                ),
                test_category:category_id (
                    name
                )
            `).eq('id', id);
            console.log(test_info)
            setSelectedId(id);
            setTestName(test_info[0].name);
            setTestDescription(test_info[0].description);
            setTestTime(test_info[0].time);
            setLevelRequirement(test_info[0].level.level_name);
            setNumberOfQuestions(test_info[0].num_of_questions);
        } else {
            setTestName('');
            setTestDescription('');
            setTestTime('');
            setLevelRequirement('');
            setNumberOfQuestions('');
        }
        onOpen();
    }

    function handleLevelRequirement(value) {
        if (value == 'Beginner') {
            return 1;
        } else if (value == 'Intermediate') {
            return 3;
        } else if (value == 'Advanced') {
            return 4;
        } else {
            return 0;
        }
    }

    async function handleSave() {
        console.log(levelRequirement);

        const updates = {
            name: testName,
            description: testDescription,
            time: testTime,
            level_requirement: handleLevelRequirement(levelRequirement),
            num_of_questions: numberOfQuestions,
            category_id: id
        };

        if (modalType === 'Editing') {
            const { error } = await supabase.from('test').update(updates).eq('id', selectedId);
            if (error) {
                console.error("Error updating test:", error);
            } else {
                onClose();
                // Refresh tests list
                const { data } = await supabase
                    .from('test')
                    .select(`
                        id,
                        name,
                        description,
                        level_requirement,
                        num_of_questions,
                        category_id,
                        time,
                        level:level_requirement (
                            level_name
                        ),
                        test_category:category_id (
                            name
                        )
                    `)
                    .eq('category_id', id);
                setTests(data);
                toast.success('Cập nhật bài kiểm tra thành công');
            }
        } else if (modalType === 'Adding') {
            // Handle adding a new test
            const { error } = await supabase.from('test').insert(updates);
            if (error) {
                console.error("Error adding test:", error);
            } else {
                onClose();
                // Refresh tests list
                const { data } = await supabase
                    .from('test')
                    .select(`
                        id,
                        name,
                        description,
                        level_requirement,
                        num_of_questions,
                        category_id,
                        time,
                        level:level_requirement (
                            level_name
                        ),
                        test_category:category_id (
                            name
                        )
                    `)
                    .eq('category_id', id);
                setTests(data);
                toast.success('Thêm bài kiểm tra thành công');
            }
        }
    }

    function handleTestNameChange(value) {
        setTestName(value);
    }

    function handleDescriptionChange(value) {
        setTestDescription(value);
    }

    function handleTimeChange(value) {
        setTestTime(value);
    }

    function handleLevelRequirementChange(value) {
        setLevelRequirement(value);
    }

    function handleNumberOfQuestionsChange(value) {
        setNumberOfQuestions(value);
    }

    return (
        <>
            <Toaster />
            <Modal size={'3xl'} isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            {modalType === "Adding" && (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm bài kiểm tra mới</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Tên bài kiểm tra</label>
                                                <input
                                                    type="text"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập tên bài kiểm tra'
                                                    value={testName}
                                                    onChange={(e) => handleTestNameChange(e.target.value)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Mô tả</label>
                                                <textarea
                                                    rows={5}
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập mô tả'
                                                    value={testDescription}
                                                    onChange={(e) => handleDescriptionChange(e.target.value)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Thời gian</label>
                                                <input
                                                    type="number"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập thời gian'
                                                    value={testTime}
                                                    onChange={(e) => handleTimeChange(e.target.value)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Yêu cầu cấp độ</label>
                                                <select
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    value={levelRequirement}
                                                    onChange={(e) => handleLevelRequirementChange(e.target.value)}>
                                                    <option value="">Chọn cấp độ yêu cầu</option>
                                                    {levels.map((level) => (
                                                        <option key={level.id} value={level.id}>{level.level_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Số lượng câu hỏi</label>
                                                <input
                                                    type="number"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập số lượng câu hỏi'
                                                    value={numberOfQuestions}
                                                    onChange={(e) => handleNumberOfQuestionsChange(e.target.value)} />
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onClick={handleSave}>
                                            Thêm
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                            {modalType === 'Editing' && (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Chỉnh sửa thông tin bài kiểm tra</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Tên bài kiểm tra</label>
                                                <input
                                                    type="text"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập tên bài kiểm tra'
                                                    value={testName}
                                                    onChange={(e) => handleTestNameChange(e.target.value)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Mô tả</label>
                                                <textarea
                                                    rows={5}
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập mô tả'
                                                    value={testDescription}
                                                    onChange={(e) => handleDescriptionChange(e.target.value)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Thời gian</label>
                                                <input
                                                    type="number"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập thời gian'
                                                    value={testTime}
                                                    onChange={(e) => handleTimeChange(e.target.value)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Yêu cầu cấp độ</label>
                                                <select
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    value={levelRequirement}
                                                    onChange={(e) => handleLevelRequirementChange(e.target.value)}>
                                                    {levels.map((level) => (
                                                        <option key={level.id} value={level.id}>{level.level_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Số lượng câu hỏi</label>
                                                <input
                                                    type="number"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập số lượng câu hỏi'
                                                    value={numberOfQuestions}
                                                    onChange={(e) => handleNumberOfQuestionsChange(e.target.value)} />
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onClick={handleSave}>
                                            Chỉnh sửa
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                            {modalType === 'Deleting' && (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Xoá bài kiểm tra</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-1 gap-4">
                                            <p>Bạn có chắc chắn muốn xoá bài kiểm tra này không?</p>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" >
                                            Xác nhận
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>
            <>
                {isLoading ? (
                    <div className='flex h-screen items-center justify-center'>
                        <Loader />
                    </div>
                ) : (
                    <div>
                        {/* <Breadcrumb pageName={tests[0].test_category.name} /> */}
                        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                            <div className="px-4 py-6 md:px-6 xl:px-7.5 flex flex-row justify-between">
                                <h4 className="text-xl font-semibold text-black dark:text-white">
                                    Danh sách bài kiểm tra
                                </h4>
                                <div>
                                    <Button
                                        onClick={() => { handleOpenModal('Adding', -1); }}
                                        className='text-white bg-green-500 font-bold hover:bg-black'
                                    >
                                        Tạo bài kiểm tra mới
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Tên bài kiểm tra</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Mô tả</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Yêu cầu cấp độ</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Số lượng câu hỏi</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Hành động</p>
                                </div>
                            </div>
                            {tests.length === 0 && (
                                <div className='px-4 py-4.5 text-center'>
                                    <p>Không có bài kiểm tra nào</p>
                                </div>
                            )}
                            {tests.map((test) => (
                                <div key={test.id} className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
                                    <div className="col-span-1 flex items-center">
                                        <p className='font-bold'>{test.name}</p>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        <p>{test.description}</p>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        <p>{test.level.level_name}</p>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        <p>{test.num_of_questions} câu hỏi</p>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        <Button className='text-white bg-blue-400' onClick={() => {
                                            router.push(`/test/${id}/${test.id}`);
                                        }}>Xem</Button>
                                        <Button className="text-white font-bold ml-2 bg-amber-400 hover:bg-black" onClick={() => { handleOpenModal('Editing', test.id) }}>Chỉnh sửa</Button>
                                        <Button className="text-white font-bold ml-2 bg-pink-400 hover:bg-black" onClick={() => { }}>Xoá</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        </>
    );
}

export default TestList;

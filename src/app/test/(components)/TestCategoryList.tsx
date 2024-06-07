"use client";

import React, { useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { createClient } from '@/utils/supabase/client';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const TestCategoryList = ({ testCategory }) => {
    const supabase = createClient();
    const router = useRouter();
    const [modalType, setModalType] = React.useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [categoryName, setCategoryName] = React.useState('');
    const [skillList, setSkillList] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState('');
    const [selectedSkill1, setSelectedSkill1] = React.useState('');
    const [selectedSkill2, setSelectedSkill2] = React.useState('');

    useEffect(() => {
        const fetchAllSkill = async () => {
            const { data: type_list, error } = await supabase.from("skill").select("id, skill_type");
            if (error) {
                console.error('Error fetching skill types:', error);
            } else {
                setSkillList(type_list || []);
            }
        }
        fetchAllSkill();
    }, []);

    async function handleOpenModal(type, id) {
        setModalType(type);
        if (id > 0) {
            const { data: current_test_category } = await supabase.from('test_category').select('*').eq('id', id);
            setSelectedId(id);
            setCategoryName(current_test_category[0].name);
            setSelectedSkill1(current_test_category[0].skill_id_1);
            setSelectedSkill2(current_test_category[0].skill_id_2);
        }
        onOpen();
    }

    function handleCategoryNameChange(nameChange) {
        setCategoryName(nameChange);
    }

    function handleSkillChange(setSkill, skill, otherSkill) {
        setSkill(skill);
        if (skill === otherSkill) {
            otherSkill === selectedSkill1 ? setSelectedSkill1('') : setSelectedSkill2('');
        }
    }

    const createNewCategory = async () => {
        if (categoryName === '' || selectedSkill1 === '' || selectedSkill2 === '') {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const { error } = await supabase.from('test_category').insert({ name: categoryName, skill_id_1: selectedSkill1, skill_id_2: selectedSkill2 });
        console.log(error);
        toast.success('Tạo chủ đề mới thành công');
        onClose();
    }

    const updateCategoryInfo = async () => {
        if (categoryName === '' || selectedSkill1 === '' || selectedSkill2 === '') {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const { error } = await supabase.from('test_category').update({ name: categoryName, skill_id_1: selectedSkill1, skill_id_2: selectedSkill2 }).eq('id', selectedId);
        console.log(error);
        toast.success('Chỉnh sửa chủ đề thành công');
        onClose();
    }

    const deleteCategory = async () => {
        const { data: test_category } = await supabase
            .from("test_category")
            .select(`
            id, 
            name,
            test (
                id
            )
        `);
        const formattedCategories = test_category.map(category => ({
            ...category,
            test_count: category.test.length,
        }));
        if (formattedCategories.find(category => category.id === selectedId).test_count > 0) {
            toast.error('Không thể xoá chủ đề này vì đã có bài thi trong chủ đề');
            onClose();
            return;
        } else {
            const { error } = await supabase.from('test_category').delete().eq('id', selectedId);
            onClose();
            toast.success('Xoá chủ đề thành công');
        }
    }

    return (
        <>
            <Toaster />
            <Modal
                size={'3xl'}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            {modalType == "Adding" && (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Thêm chủ đề mới</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Tên chủ đề</label>
                                                <input
                                                    type="text"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập tên chủ đề'
                                                    value={categoryName}
                                                    onChange={(e) => handleCategoryNameChange(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Lựa chọn kỹ năng 1</label>
                                                <select
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    value={selectedSkill1}
                                                    onChange={(e) => handleSkillChange(setSelectedSkill1, e.target.value, selectedSkill2)}
                                                >
                                                    <option value="">Chọn kỹ năng</option>
                                                    {skillList.filter(skill => skill.id !== selectedSkill2).map(skill => (
                                                        <option key={skill.id} value={skill.id}>{skill.skill_type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Lựa chọn kỹ năng 2</label>
                                                <select
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    value={selectedSkill2}
                                                    onChange={(e) => handleSkillChange(setSelectedSkill2, e.target.value, selectedSkill1)}
                                                >
                                                    <option value="">Chọn kỹ năng</option>
                                                    {skillList.filter(skill => skill.id !== selectedSkill1).map(skill => (
                                                        <option key={skill.id} value={skill.id}>{skill.skill_type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={createNewCategory}>
                                            Thêm
                                        </Button>
                                    </ModalFooter>
                                </>
                            )
                            }
                            {modalType == 'Editing' && (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Chỉnh sửa chủ đề</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Tên chủ đề</label>
                                                <input
                                                    type="text"
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    placeholder='Nhập tên chủ đề'
                                                    value={categoryName}
                                                    onChange={(e) => handleCategoryNameChange(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Lựa chọn kỹ năng 1</label>
                                                <select
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    value={selectedSkill1}
                                                    onChange={(e) => handleSkillChange(setSelectedSkill1, e.target.value, selectedSkill2)}
                                                >
                                                    <option value="">Chọn kỹ năng</option>
                                                    {skillList.filter(skill => skill.id !== selectedSkill2).map(skill => (
                                                        <option key={skill.id} value={skill.id}>{skill.skill_type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold">Lựa chọn kỹ năng 2</label>
                                                <select
                                                    className="border border-stroke rounded-md px-2 py-1"
                                                    value={selectedSkill2}
                                                    onChange={(e) => handleSkillChange(setSelectedSkill2, e.target.value, selectedSkill1)}
                                                >
                                                    <option value="">Chọn kỹ năng</option>
                                                    {skillList.filter(skill => skill.id !== selectedSkill1).map(skill => (
                                                        <option key={skill.id} value={skill.id}>{skill.skill_type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={updateCategoryInfo}>
                                            Chỉnh sửa
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                            {modalType == 'Deleting' && (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Xoá chủ đề</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-1 gap-4">
                                            <p>Bạn có chắc chắn muốn xoá chủ đề {categoryName}</p>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="light" onPress={onClose}>
                                            Đóng
                                        </Button>
                                        <Button color="primary" onPress={deleteCategory}>
                                            Xác nhận
                                        </Button>
                                    </ModalFooter>
                                </>
                            )
                            }
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                <div className="px-4 py-6 md:px-6 xl:px-7.5 flex flex-row justify-between">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Danh sách chủ đề bài kiểm tra
                    </h4>
                    <div>
                        <Button
                            onClick={() => { handleOpenModal('Adding', -1); }}
                            className='text-white bg-green-500 font-bold hover:bg-black'
                        >
                            Tạo chủ đề mới
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-3 flex items-center">
                        <p className="font-medium">Tên phần</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="font-medium">Số lượng bài thi</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="font-medium">Hành động</p>
                    </div>
                </div>
                {testCategory.map((category) => (
                    <div key={category.id} className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-3 flex items-center font-bold">
                            <p>{category.name}</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <p>{category.test_count} bài thi</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Button className="text-white font-bold bg-blue-400 hover:bg-black" onClick={() => {
                                router.push('/test/' + category.id);
                            }}>Xem</Button>
                            <Button className="text-white font-bold ml-2 bg-amber-400 hover:bg-black" onClick={() => { handleOpenModal('Editing', category.id); }}>Chỉnh sửa</Button>
                            <Button className="text-white font-bold ml-2 bg-pink-400 hover:bg-black" onClick={() => { handleOpenModal('Deleting', category.id) }}>Xoá</Button>
                        </div>
                    </div>
                ))}
            </div >
        </>
    );
};

export default TestCategoryList;

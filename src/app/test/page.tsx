"use client";

import { useEffect, useState } from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createClient } from "@/utils/supabase/client";
import TestCategoryList from "./(components)/TestCategoryList";

// export const metadata: Metadata = {
//     title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
//     description:
//         "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

const BasicChartPage: React.FC = () => {
    const supabase = createClient();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: test_category } = await supabase
                .from("test_category")
                .select(`
                    id, 
                    name,
                    test (
                        id
                    )
                `);

            // Format the data to include the count of tests in each category
            const formattedCategories = test_category.map(category => ({
                ...category,
                test_count: category.test.length,
            }));

            setCategories(formattedCategories);
        };

        fetchInitialData();

        // Create a function to handle changes
        const handleChanges = (payload) => {
            console.log('Change received!', payload);
            // Fetch the updated data after any change
            fetchInitialData();
        };

        // Listen to all changes in all tables in the public schema
        const subscription = supabase
            .channel('public:*')
            .on('postgres_changes', { event: '*', schema: 'public' }, handleChanges)
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Bài kiểm tra" />
            <div className="flex flex-col gap-10">
                <TestCategoryList testCategory={categories} />
            </div>
        </DefaultLayout>
    );
};

export default BasicChartPage;

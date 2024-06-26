import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createClient } from "@/utils/supabase/client";
import DropdownDefault from "@/components/Dropdowns/DropdownDefault";
import AddLayout from "./(components)/AddLayout";

// export const metadata: Metadata = {
//     title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
//     description:
//         "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };


const BasicChartPage: React.FC = async () => {
    const supabase = createClient();

    const { data: notes } = await supabase.from("question").select();
    // return <pre>{JSON.stringify(notes, null, 2)}</pre>
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm câu hỏi mới" />
            <div className="flex flex-col gap-10">
                <AddLayout />
            </div>
        </DefaultLayout>
    );
};

export default BasicChartPage;

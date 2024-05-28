import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createClient } from "@/utils/supabase/client";
import PraticeSkillList from "./(components)/PraticeSkillList";


export const metadata: Metadata = {
    title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};


const PraticePartPage: React.FC = async () => {
    const supabase = createClient();

    const { data: part } = await supabase.from("part").select();

    console.log(part);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Luyện tập" />
            <div className="flex flex-col gap-10">
                <PraticeSkillList part={part} />
            </div>
        </DefaultLayout>
    );
};

export default PraticePartPage;

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PartDetailManagement } from "./PartDetailManagement";
import PartList from "../(components)/PartList";
import { createClient } from "@/utils/supabase/client";

export default async function page({ params }) {
    const supabase = createClient();

    const { data: partlist, error } = await supabase
        .from("part")
        .select(`
            id,
            part_index,
            part_name,
            skill,
            questions:question (
                part_id
            )
        `)
        .eq("skill", params.skill);

    if (error) {
        console.error("Error fetching parts with question count:", error);
        return null;
    }

    const partsWithQuestionCount = partlist.map(part => ({
        ...part,
        question_count: part.questions.length
    }));

    return (
        <DefaultLayout>
            <Breadcrumb pageName={params.skill} />
            <div className="flex flex-col gap-10">
                <PartList partname={params.skill} partlist={partsWithQuestionCount} />
            </div>
        </DefaultLayout>
    );
}

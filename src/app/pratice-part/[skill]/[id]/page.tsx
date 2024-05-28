import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createClient } from "@/utils/supabase/client";
import QuestionList from "../../(components)/QuestionList";

export default async function page({ params }) {
    const supabase = createClient();
    const { data: partName, error } = await supabase.from("part").select('part_name').eq('id', params.id);


    return (
        <DefaultLayout>
            <Breadcrumb pageName={partName[0].part_name} />
            <div className="flex flex-col gap-10">
                <QuestionList partId={params.id} partName={partName[0].part_name} />
            </div>
        </DefaultLayout>
    );
}

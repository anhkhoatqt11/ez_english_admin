import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createClient } from "@/utils/supabase/client";
import TestList from "../(components)/TestList";


export default async function page({ params }) {
    const supabase = createClient();

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <TestList id={params.category_id} />
            </div>
        </DefaultLayout>
    );

}
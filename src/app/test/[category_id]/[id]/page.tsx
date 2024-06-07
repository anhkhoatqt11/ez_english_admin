import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TestQuestionList from "../../(components)/TestQuestionList";



export default async function page({ params }) {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <TestQuestionList categoryId={params.category_id} testId={params.id} />
            </div>
        </DefaultLayout>
    )

}
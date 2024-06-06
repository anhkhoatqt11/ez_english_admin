import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditLayout from "./(components)/EditLayout";

export default async function page({ params }) {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <EditLayout id={params.id} />
            </div>
        </DefaultLayout>
    )
}
import AddLayout from "@/app/test/(components)/AddLayout";
import DefaultLayout from "@/components/Layouts/DefaultLayout";



export default async function page({ params }) {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <AddLayout testId={params.id} />
            </div>
        </DefaultLayout>
    )
}
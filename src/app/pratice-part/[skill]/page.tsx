import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PartDetailManagement } from "./PartDetailManagement";

export default function page({ params }) {
    return (
        <DefaultLayout>
            <Breadcrumb pageName={params.skill} />
            <div className="flex flex-col gap-10">
                <PartDetailManagement part={params.skill} />
            </div>
        </DefaultLayout>
    );
}

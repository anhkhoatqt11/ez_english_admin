import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createClient } from '@supabase/supabase-js'
import UserDataTable from "./(components)/UserDataTable";


export const metadata: Metadata = {
    title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const supabase = createClient("https://txtkdxqiihbhcqrhippj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4dGtkeHFpaWhiaGNxcmhpcHBqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMDg1NjQyNSwiZXhwIjoyMDI2NDMyNDI1fQ._yGeKQA2RdA4HYUSYzGuOSDf50uxr7aAjwFXbBJffnk", {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})



const BasicChartPage: React.FC = async () => {
    const adminAuthClient = supabase.auth.admin

    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    // return <pre>{JSON.stringify(users, null, 2)}</pre>
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Người dùng" />
            <div className="flex flex-col gap-10">
                <UserDataTable data={users} />
            </div>
        </DefaultLayout>
    );
};

export default BasicChartPage;

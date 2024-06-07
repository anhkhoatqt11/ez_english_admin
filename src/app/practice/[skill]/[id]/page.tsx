"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createClient } from "@/utils/supabase/client";
import QuestionList from "../../(components)/QuestionList";

export default function Page({ params }) {
    const supabase = createClient();
    const [partName, setPartName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data, error } = await supabase.from("part").select('part_name').eq('id', params.id);
            if (data && data.length > 0) {
                setPartName(data[0].part_name);
            }
            setLoading(false);
        };

        fetchInitialData();

        // Create a function to handle changes
        const handleChanges = (payload) => {
            console.log('Change received!', payload);
            // Fetch the updated data after any change
            fetchInitialData();
        };

        // Listen to all changes in all tables in the public schema
        const subscription = supabase
            .channel('public:*')
            .on('postgres_changes', { event: '*', schema: 'public' }, handleChanges)
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, params.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={partName} />
            <div className="flex flex-col gap-10">
                <QuestionList partId={params.id} partName={partName} />
            </div>
        </DefaultLayout>
    );
}
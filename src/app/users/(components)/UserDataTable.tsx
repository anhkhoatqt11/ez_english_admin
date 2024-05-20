import React from "react";

interface UserData {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: {
        provider: string;
        providers: string[];
    };
    user_metadata: object;
    identities: null;
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
}

const UserDataTable: React.FC<{ data: UserData[] }> = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-4 py-6 md:px-6 xl:px-7.5">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        User Data
                    </h4>
                </div>

                <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-1 flex items-center">
                        <p className="font-medium">ID</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="font-medium">Email</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-medium">Role</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-medium">Phone</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-medium">Created At</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-medium">Last Sign In</p>
                    </div>
                </div>

                <div>
                    {data.map((user, index) => (
                        <div
                            key={index}
                            className={
                                index % 2 === 0
                                    ? "grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-gray-100"
                                    : "grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-white"
                            }
                        >
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{user.id}</p>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-black dark:text-white">{user.email}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{user.role}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{user.phone}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{user.created_at}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{user.last_sign_in_at}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDataTable;
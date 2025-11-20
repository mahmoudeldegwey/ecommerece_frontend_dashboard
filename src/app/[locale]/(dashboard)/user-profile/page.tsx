"use client";
import UpdateDateForm from './UpdateDateForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import { Tabs } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi";
import { MdOutlinePassword } from "react-icons/md";
import {useTranslations} from 'next-intl';

const userProfilePage = () => {
    const t = useTranslations('UserProfile');
    return (
        <div>
            <div className="overflow-x-auto p-4">
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <Tabs aria-label="Full width tabs" variant="fullWidth">
                        <Tabs.Item active title={t('change_data')} icon={HiUserCircle}>
                            <UpdateDateForm />
                        </Tabs.Item>

                        <Tabs.Item title={t('change_password')} icon={MdOutlinePassword}>
                            <UpdatePasswordForm />
                        </Tabs.Item>   
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default userProfilePage;
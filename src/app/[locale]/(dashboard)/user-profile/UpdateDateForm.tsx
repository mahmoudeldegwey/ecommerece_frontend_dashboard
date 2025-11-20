"use client";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { HiMail } from "react-icons/hi";
import { FaSave } from "react-icons/fa";
import {useTranslations} from 'next-intl';
import SaveButton from "./SaveButton";
import { useSession} from "next-auth/react";

const UpdateDateForm = () => {
    const t = useTranslations('UserProfile');
    const { data: session, status } = useSession(); 
    return (
        <div>
            <form className="w-full">
                <div className="flex flex-row gap-2">
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="email4" value={t('email')} />
                        </div>
                        <TextInput id="email4" type="email" icon={HiMail} placeholder="mail@exampl.com" value={session?.user?.user?.email ?? ''} required />
                    </div>
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="username3" value={t('Username')} />
                        </div>
                        <TextInput id="username3" placeholder="Username" addon="@" value={session?.user?.user?.name ?? ''} required />
                    </div>
                </div>
                <SaveButton />
            </form>
        </div>
    )   
}

export default UpdateDateForm;
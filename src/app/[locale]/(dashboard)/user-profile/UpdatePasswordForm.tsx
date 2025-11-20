"use client";

import { Button, Label, TextInput } from "flowbite-react";
import {useTranslations} from 'next-intl';
import SaveButton from "./SaveButton";

const UpdatePasswordForm = () => {
    const t = useTranslations('UserProfile');
    return (
        <div>
            <form className=" w-ful">
                <div className="flex flex-row gap-2">
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="password2" value={t('password')} />
                        </div>
                        <TextInput id="password2" type="password" required shadow />
                    </div>
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="repeat-password" value={t('confirm_password')} />
                        </div>
                        <TextInput id="repeat-password" type="password" required shadow />
                    </div>
                </div>
               <SaveButton />
            </form>

        </div>
    )   
}

export default UpdatePasswordForm;
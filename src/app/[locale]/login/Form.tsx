"use client";
import { loginSchema } from "@/utils/validationSchema";
import { toast } from "react-toastify";
import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {useTranslations} from 'next-intl';
import { useLocale } from "next-intl";
import { cp } from "fs";

const LoginForm = () => { 
    const router = useRouter();

    const t_validation = useTranslations('Validation');
    const currentLocale = useLocale();

    const loginAction = async (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        
        const Schema = loginSchema(t_validation);

        const validation = Schema.safeParse({ email, password });
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }
    
        try {
            
            const result =  await signIn("credentials", { email, password, redirect: false });

            if (result?.ok === false) {
                toast.error(t_validation('login_failed'));
                return;
            }

            toast.success(t_validation('login_success'));

            setTimeout(() => {
                router.replace(`/${currentLocale}/dashboard`);                
            }, 1000);

        } catch (error) {
            toast.error(`Something went wrong. Please try again. ${error}`);
        }
    };
    return (
        <form className="space-y-4 md:space-y-6" action={loginAction}>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="string" 
                    name="email" 
                    id="email" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="name@company.com" />
            </div>
            <div>
                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input 
                            id="remember" 
                            aria-describedby="remember" 
                            type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                             />
                    </div>
                    <div className="ml-3 text-sm">
                        <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                </div>
            </div>
            <button 
                type="submit" 
                style={{backgroundColor: 'rgb(37 99 235 / var(--tw-bg-opacity, 1))'}}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Sign in
            </button>
            
        </form>
    )
}

export default LoginForm
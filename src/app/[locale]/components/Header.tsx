"use client";

import { ThemeModeScript } from 'flowbite-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import LanguageSwitcher from "@/app/[locale]/components/LanguageSwitcher";
import { Dropdown } from "flowbite-react";

const Header = () => {
    const { data: session, status } = useSession();

    return (
        <header>
            <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" width={30} height={30} />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">E-commerece</span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <LanguageSwitcher/> 
                        <div className="px-4">
                            <Dropdown label={session?.user?.user.email} dismissOnClick={false} renderTrigger={() => <span> {session?.user?.user?.name || "User"} </span>}>
                                <Dropdown.Item>
                                    <Link href="/">Dashboard</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link href="/user-profile">Settings</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>Sign out</Dropdown.Item>
                            </Dropdown>
                        </div>
                    </div>

                </div>
            </nav>
        </header>
    );
};

export default Header;
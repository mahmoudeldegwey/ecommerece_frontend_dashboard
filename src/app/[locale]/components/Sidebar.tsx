"use client";

import Link from 'next/link';
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {useTranslations} from 'next-intl';
import { IoSettingsOutline,IoLogOutOutline, IoBusOutline } from "react-icons/io5";
import { FaUsers,FaUserShield } from "react-icons/fa6";
import { FaProductHunt, FaShoppingCart } from "react-icons/fa";
import { RiCoupon2Fill } from "react-icons/ri";
import { RiDashboard2Fill } from "react-icons/ri";
import { useLocale } from "next-intl";
import { PiUsersFourBold } from "react-icons/pi";
import { MdReviews } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";

const Sidebar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const t = useTranslations('Sidebar');
    const { data: session } = useSession();
    const locale = useLocale();

    return (
        <div>
            <button 
                data-drawer-target="sidebar-multi-level-sidebar" 
                data-drawer-toggle="sidebar-multi-level-sidebar" 
                aria-controls="sidebar-multi-level-sidebar" 
                type="button" 
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link href={"/" + locale + "/dashboard"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <RiDashboard2Fill/>
                            <span className="ms-3">{t('dashboard')}</span>
                        </Link>
                    </li>
                    <li>
                        <button 
                            type="button" 
                            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" 
                            aria-controls="dropdown-ecommerece" 
                            data-collapse-toggle="dropdown-ecommerece"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                            <FaProductHunt />
                            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{t('products')}</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </button>
                        <ul id="dropdown-ecommerece" className={`py-2 space-y-2 ${isDropdownOpen ? "block" : "hidden"}`}>
                            <li>
                                <Link href={"/" + locale + "/products"} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">{t('products')}</Link>
                            </li>
                            
                            <li>
                                <Link href={"/" + locale + "/categories"} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">{t('categories')}</Link>
                            </li>
                            <li>
                                <Link href={"/" + locale + "/brands"} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">{t('brands')}</Link>
                            </li>
                            <li>
                                <Link href={"/" + locale + "/colors"} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">{t('colors')}</Link>
                            </li>
                            <li>
                                <Link href={"/" + locale + "/sizes"} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">{t('sizes')}</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/product-reviews"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <MdReviews />
                            <span className="flex-1 ms-3 whitespace-nowrap">{t('product_reviews')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/orders"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <FaShoppingCart />
                            <span className="flex-1 ms-3 whitespace-nowrap">{t('orders')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/announcements"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <TfiAnnouncement />
                            <span className="flex-1 ms-3 whitespace-nowrap">{t('announcements')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/clients"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <PiUsersFourBold />
                            <span className="flex-1 ms-3 whitespace-nowrap">{t('clients')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/coupons"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <RiCoupon2Fill/>
                        <span className="flex-1 ms-3 whitespace-nowrap">{t('coupons')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/users"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <FaUsers />
                            <span className="flex-1 ms-3 whitespace-nowrap">{t('users')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/roles"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FaUserShield />
                            <span className="flex-1 ms-3 whitespace-nowrap">{t('roles')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={"/" + locale + "/settings"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <IoSettingsOutline />
                        <span className="flex-1 ms-3 whitespace-nowrap">{t('settings')}</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link href="" onClick={() => signOut()} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <IoLogOutOutline />
                        <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                        </Link>
                    </li>
             

                </ul>
            </div>
            </aside>
           

        </div>
    );
}

export default Sidebar;
"use client";
import { Tabs } from "flowbite-react";
import {useTranslations} from 'next-intl';
import { IoSettingsOutline } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import GeneralForm from "./GeneralForm";
import PaymentForm from "./PaymentForm";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const SettingPage = () => {
    const t = useTranslations('SettingsPage');
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        website_name: "",
        website_name_ar: "",
        website_description: "",
        website_description_ar: "",
        email: "",
        phone_number: "",
        copyrights: "",
        copyrights_ar: "",
        default_language: "en",
        default_currency: "USD",
        default_country: "EGY",
        instapay_enable:0,
        instapay_tag:"",
        instapay_bankname:"",
        instapay_account_number:"",
        instapay_company_name:""
    });

    // Fetch settings data
    const getSettings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/settings`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Map fetched data to form fields
            Object.entries(data).forEach(([key, value]) => {
                setFormData((prev) => ({
                    ...prev,
                    [key]: value ?? "",
                }));
            });

        } catch (e) {
            console.error("Something went wrong:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.token) {
            getSettings();
        }
    }, [session]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <p>loading...</p>;

    const saveSettings = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept":"application/json",
                    "Authorization": `Bearer ${session?.user?.token}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(handleFormData()),
            });

            const data = await response.json();

            if (!data.check) {
                throw new Error(`HTTP error! Status: ${data.message}`);
            }

            toast.success("Settings saved successfully!");

        } catch (e) {
            //console.error("Something went wrong:", ${e});
        }
    }

    const handleFormData = () => {
        const settingsData:any = [];
        const data = Object.entries(formData);

        data.forEach((setting) => {
            settingsData.push({
                key: setting[0],
                value: setting[1],
            });
        });

        return {
            "settings": settingsData,
        };
    };

    return (
        <div>
            <div className="overflow-x-auto p-4">
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h1 className="font-bold mb-4">{t('settings')}</h1>
                    <Tabs aria-label="Full width tabs" variant="fullWidth">
                        <Tabs.Item active title={t('general')} icon={IoSettingsOutline}>
                           <GeneralForm 
                           formData={formData} 
                           handleChange={handleChange} 
                           saveSettings={saveSettings} 
                           />
                        </Tabs.Item>

                        <Tabs.Item title={t('payments')} icon={MdPayment}>
                            <PaymentForm 
                            formData={formData} 
                            handleChange={handleChange} 
                            saveSettings={saveSettings}
                            />
                        </Tabs.Item>   
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default SettingPage;
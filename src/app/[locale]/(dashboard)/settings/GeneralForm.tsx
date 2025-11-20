"use client";

import { useTranslations } from "next-intl";
import SaveButton from "./SaveButton";
import { Button, Label, Textarea, TextInput,Select } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const GeneralForm = ({formData,handleChange,saveSettings}) => {

    //console.log(params, "params");
    const t = useTranslations("SettingsPage");
    const { data: session } = useSession();

    return (
        <div>
            <form className="w-full">
                <div className="flex flex-row gap-2">
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="website_name" value={t("website_name")} />
                        </div>
                        <TextInput id="website_name" type="text" name="website_name" value={formData.website_name} onChange={handleChange}  />
                    </div>
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="website_name_ar" value={t("website_name_ar")} />
                        </div>
                        <TextInput id="website_name_ar" type="text" name="website_name_ar" value={formData.website_name_ar} onChange={handleChange}  />
                    </div>
                </div>

                <div className="flex flex-row gap-2 mt-4">
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="website_description" value={t("website_description")} />
                        </div>
                        <Textarea id="website_description" name="website_description" value={formData.website_description} onChange={handleChange}  />
                    </div>
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="website_description_ar" value={t("website_description_ar")} />
                        </div>
                        <Textarea id="website_description_ar" name="website_description_ar" value={formData.website_description_ar} onChange={handleChange}  />
                    </div>
                </div>

                <div className="flex flex-row gap-2 mt-4">
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="email" value={t("email")} />
                        </div>
                        <TextInput id="email" type="text" name="email" value={formData.email} onChange={handleChange}  />
                    </div>
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="phone_number" value={t("phone_number")} />
                        </div>
                        <TextInput id="phone_number" type="text" name="phone_number" value={formData.phone_number} onChange={handleChange}  />
                    </div>
                </div>

                <div className="flex flex-row gap-2 mt-4">
                    <div className="w-1/3">
                        <div className="mb-2 block">
                            <Label htmlFor="default_language" value={t("default_language")} />
                        </div>
                        <Select id="default_language" name="default_language" value={formData.default_language} onChange={handleChange}>
                            <option value="en">English</option>
                            <option value="ar">Arabic</option>
                        </Select>
                     </div>
                    <div className="w-1/3">
                        <div className="mb-2 block">
                            <Label htmlFor="default_country" value={t("default_country")} />
                        </div>
                        <Select id="default_country" name="default_country" value={formData.default_country} onChange={handleChange}>
                            <option value="sa">Saudi</option>
                            <option value="eg">Egypt</option>
                        </Select>
                     </div>
                     <div className="w-1/3">
                        <div className="mb-2 block">
                            <Label htmlFor="default_currency" value={t("default_currency")} />
                        </div>
                        <Select id="default_currency" name="default_currency" value={formData.default_currency} onChange={handleChange}>
                            <option value="egp">EGP</option>
                            <option value="usd">USD</option>
                            <option value="sar">SAR</option>
                        </Select>
                     </div>
                </div>

                <div className="flex flex-row gap-2 mt-4">
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="copyrights" value={t("copyrights")} />
                        </div>
                        <TextInput id="copyrights" type="text" name="copyrights" value={formData.copyrights} onChange={handleChange}  />
                    </div>
                    <div style={{ width: "50%" }}>
                        <div className="mb-2 block">
                            <Label htmlFor="copyrights_ar" value={t("copyrights_ar")} />
                        </div>
                        <TextInput id="copyrights_ar" type="text" name="copyrights_ar" value={formData.copyrights_ar} onChange={handleChange}  />
                    </div>
                </div>

                <SaveButton saveOnClick={saveSettings} />
            </form>
        </div>
    );
};

export default GeneralForm;

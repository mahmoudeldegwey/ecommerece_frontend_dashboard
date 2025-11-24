import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card } from 'flowbite-react';
import { TextInput, Label, ToggleSwitch,Checkbox } from 'flowbite-react';
import SaveButton from "./SaveButton";

const PaymentForm = ({formData,handleChange,saveSettings}) => {

  const t = useTranslations('SettingsPage');

    const [instapayEnabled, setInstapayEnabled] = useState(false);

    const [bankTransferEnabled, setBankTransferEnabled] = useState(false);
    const [bankName, setBankName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");

    const handleCheckbox = (checked) => {
        // Use the provided handleChange prop so parent state stays in sync
        handleChange({ target: { name: 'instapay_enable', value: checked ? 1 : 0 } });
    };


  return (
    <div className="space-y-6">
        {/* <h1 className="text-2xl font-bold">Payment Settings</h1> */}
        <form className="w-full">
            {/* Instapay */}
            <Card className="p-4 rounded-2xl shadow mb-3">
                <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Instapay</span>
                    <ToggleSwitch checked={instapayEnabled} onChange={setInstapayEnabled} />
                </div>

                {instapayEnabled && (
                    
                <div className="space-y-4">
                    {/* Checkbox inside CardContent */}
                    
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={formData.instapay_enable == 1}
                                onChange={(e) => handleCheckbox(Boolean(e.target.checked))}
                                className="h-5 w-5"
                                name="instapay_enable"
                            />
                            <label className="text-sm">Enable Instapay</label>
                        </div>
                    <div>
                    <Label>Instapay ID</Label>
                    <TextInput 
                        placeholder="example@insta" 
                        name='instapay_id'
                        value={formData.instapay_tag} onChange={handleChange}
                        />
                    </div>
                    <div>
                    <Label>Bank Name</Label>
                    <TextInput 
                        name='instapay_bankname'
                        value={formData.instapay_bankname} onChange={handleChange}
                        placeholder="Commercial International Bank" 
                        />
                    </div>
                    <div>
                    <Label>Account Number</Label>
                    <TextInput 
                        name='instapay_account_number'
                        value={formData.instapay_account_number} onChange={handleChange} 
                    />
                    </div>
                    <div>
                    <Label>Company Name</Label>
                    <TextInput 
                        name='instapay_company_name'
                        value={formData.instapay_company_name} onChange={handleChange}  
                    />
                    </div>
                </div>
                )}
            </Card>


            <SaveButton saveOnClick={saveSettings} />
        </form>
    </div>
    );
}

export default PaymentForm
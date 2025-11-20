import {useTranslations} from 'next-intl';
import SaveButton from "./SaveButton";

const PaymentForm = () => {
    const t = useTranslations('SettingsPage');
    return  (
        <div>
            <h1>Payment Form</h1>
        </div>
    )
}

export default PaymentForm;
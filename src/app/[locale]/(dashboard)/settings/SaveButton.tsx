import { Button   } from "flowbite-react";
import { FaSave } from "react-icons/fa";
import {useTranslations} from 'next-intl';

const SaveButton = ({saveOnClick}) => {
    const t = useTranslations('UserProfile');
    
    return (
        <div className="block pt-8">
        <Button type="submit" onClick={saveOnClick} >
            <FaSave className="inline-block mr-2 mt-1" />
            {t('save')}
        </Button>
    </div>
    )
}

export default SaveButton;
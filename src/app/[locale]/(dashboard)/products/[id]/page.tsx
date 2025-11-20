
import { TabItem, Tabs } from "flowbite-react";
import EditFormGeneralInfo from "../components/EditFormGeneralInfo";
import UploadProductImages from "../components/UploadProductImages";
import { useTranslations } from 'next-intl';

const ProductEdit = ({params}:{
    params: {id:number}
}) => {    

    const id = params.id;
    const t = useTranslations('EditProduct');
    
    return (
        <div>
            <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">{t('Edit_product')}</h1>
            <div className="space-y-6">
                <Tabs aria-label="Tabs with underline" variant="underline">
                    <TabItem  title="General Info">
                        <EditFormGeneralInfo id={id} />
                    </TabItem>
                    <TabItem title="Images" >
                        <UploadProductImages id={id} />
                    </TabItem>
                
                </Tabs>
            </div>
            </div>
        </div>
    );
}

export default ProductEdit;
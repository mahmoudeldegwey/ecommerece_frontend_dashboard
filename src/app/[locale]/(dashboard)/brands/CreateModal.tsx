"use client";
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { createBrand } from '@/utils/actions/brands/actions';
import { toast } from 'react-toastify';
import { BrandSchema} from "@/utils/validationSchema";

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshBrandsList: () => void;
}

const CreateModal = ({ isOpen, onClose, refreshBrandsList }: CreateModalProps) => {
    const { data: session } = useSession();
    const t = useTranslations('BrandsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
    });

    const handleSubmit = () => {

        const name = formData.name;
        const name_ar = formData.name_ar;

        const schema = BrandSchema(t_validation)
        
        const validation = schema.safeParse({ name , name_ar});
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        createBrand(
            session?.user?.token,
            formData.name,
            formData.name_ar
        ).then(result => {
            if(result.message) {
                toast.success(result.message);
                refreshBrandsList();
                onClose();
                setFormData({
                    name: '',
                    name_ar: '',
                });
            }
        }).catch(error => {
            toast.error(error.message);
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_brand')}</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name" value={t_general('name')} />
                        </div>
                        <TextInput
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name_ar" value={t_general('name_ar')} />
                        </div>
                        <TextInput
                            id="name_ar"
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit}>{t_general('create')}</Button>
                <Button color="gray" onClick={onClose}>
                    {t_general('cancel')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateModal;

"use client";
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { editBrand } from '@/utils/actions/brands/actions';
import { toast } from 'react-toastify';

interface Brand {
    id: number;
    name: string;
    name_ar: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshBrandsList: () => void;
    brandData: Brand;
}

const EditModal = ({ isOpen, onClose, refreshBrandsList, brandData }: EditModalProps) => {
    const { data: session } = useSession();
    const t = useTranslations('BrandsPage');
    const t_general = useTranslations('General');

    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
    });

    useEffect(() => {
        if (brandData) {
            setFormData({
                name: brandData.name || '',
                name_ar: brandData.name_ar || '',
            });
        }
    }, [brandData]);

    const handleSubmit = () => {
        editBrand(
            session?.user?.token,
            brandData.id,
            formData.name,
            formData.name_ar
        ).then(result => {
            if(result.message) {
                toast.success(result.message);
                refreshBrandsList();
                onClose();
            }
        }).catch(error => {
            toast.error(error.message);
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('edit_brand')}</Modal.Header>
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
                <Button onClick={handleSubmit}>{t_general('edit')}</Button>
                <Button color="gray" onClick={onClose}>
                    {t_general('cancel')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;

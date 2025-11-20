"use client";
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { createSize } from '@/utils/actions/sizes/actions';
import { toast } from 'react-toastify';
import { SizeSchema } from "@/utils/validationSchema";

interface CustomSession {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        token?: string;
    };
}

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshSizesList: (page?: number, params?: { name?: string }) => void;
}

const CreateModal = ({ isOpen, onClose, refreshSizesList }: CreateModalProps) => {
    const { data: session } = useSession() as { data: CustomSession };
    const t = useTranslations('SizesPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
    });

    const handleSubmit = () => {
        const name = formData.name;
        const name_ar = formData.name_ar;

        const schema = SizeSchema(t_validation)
        
        const validation = schema.safeParse({ name , name_ar});
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        if (session?.user?.token) {
            createSize(
                session.user.token,
                formData.name,
                formData.name_ar
            ).then(result => {
                if(result.message) {
                    toast.success(result.message);
                    refreshSizesList();
                    onClose();
                    setFormData({
                        name: '',
                        name_ar: '',
                    });
                }
            }).catch(error => {
                toast.error(error.message);
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_size')}</Modal.Header>
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

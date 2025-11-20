"use client";
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { createColor } from '@/utils/actions/colors/actions';
import { toast } from 'react-toastify';
import { ColorSchema } from "@/utils/validationSchema";

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
    refreshColorsList: (page?: number, params?: { name?: string }) => void;
}

const CreateModal = ({ isOpen, onClose, refreshColorsList }: CreateModalProps) => {
    const { data: session } = useSession() as { data: CustomSession };
    const t = useTranslations('ColorsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
        value:''
    });

    const handleSubmit = () => {
        const name = formData.name;
        const name_ar = formData.name_ar;
        const value = formData.value;

        const schema = ColorSchema(t_validation)
        
        const validation = schema.safeParse({ name , name_ar, value});
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        if (session?.user?.token) {
            createColor(
                session.user.token,
                formData.name,
                formData.name_ar,
                formData.value
            ).then(result => {
                if(result.message) {
                    toast.success(result.message);
                    refreshColorsList();
                    onClose();
                    setFormData({
                        name: '',
                        name_ar: '',
                        value: ''
                    });
                }
            }).catch(error => {
                toast.error(error.message);
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_color')}</Modal.Header>
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
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="value" value={t('value')} />
                        </div>
                        <TextInput
                            id="value"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            required
                            type="color"
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

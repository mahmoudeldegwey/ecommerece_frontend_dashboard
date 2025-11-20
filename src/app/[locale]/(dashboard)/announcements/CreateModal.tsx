"use client";
import { Button, Label, Modal, TextInput, Textarea , Select, Checkbox } from 'flowbite-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { createAnnouncement } from '@/utils/actions/announcements/actions';
import { toast } from 'react-toastify';
import { AnnouncementSchema } from "@/utils/validationSchema";
// import { Textarea } from 'flowbite-react/components/Textarea';

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
    refreshAnnouncementsList: (page?: number, params?: { name?: string }) => void;
}

const CreateModal = ({ isOpen, onClose, refreshAnnouncementsList }: CreateModalProps) => {
    const { data: session } = useSession() as { data: CustomSession };
    const t = useTranslations('AnnouncementsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [formData, setFormData] = useState({
        name: '',
        message: '',
        start_at: '',
        end_at: '',
        is_active: false
    });

    const handleSubmit = () => {
        const { name, message, start_at, end_at, is_active } = formData;
        console.log('Form Data:', formData);
        const schema = AnnouncementSchema(t_validation)
        
        const validation = schema.safeParse({ name, message ,start_at, end_at, is_active });

        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        if (session?.user?.token) {
            createAnnouncement(
                session.user.token,
               { name,
                message,
                start_at,
                end_at,
                is_active 
            }
            ).then(result => {
                if(result.message) {
                    toast.success(result.message);
                    refreshAnnouncementsList();
                    onClose();
                    setFormData({
                        name: '',
                        message: '',
                        start_at: '',
                        end_at: '',
                        is_active: false,
                    });
                }
            }).catch(error => {
                toast.error(error.message);
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_announcement')}</Modal.Header>
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
                            <Label htmlFor="message" value={t('message')} />
                        </div>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="start_at" value={t('start_at')} />
                        </div>
                        <TextInput
                            id="start_at"
                            value={formData.start_at}
                            onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                            required
                            type="date"
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="end_at" value={t('end_at')} />
                        </div>
                        <TextInput
                            id="end_at"
                            value={formData.end_at}
                            onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                            required
                            type="date"
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="is_active" value={t('is_active')} />
                        </div>
                        <Checkbox
                            id="is_active"
                            value={formData.is_active ? 1 : 0}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
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

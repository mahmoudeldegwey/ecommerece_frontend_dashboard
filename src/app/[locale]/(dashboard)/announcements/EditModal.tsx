"use client";
import { Button, Label, Modal, TextInput,Textarea ,Select, Checkbox } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { AnnouncementSchema } from "@/utils/validationSchema";
import { editAnnouncement } from '@/utils/actions/announcements/actions';

interface CustomSession {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        token?: string;
    };
}

interface Announcement {
  id: number;
  name: string;
  message: string;
  start_at: string;
  end_at: string;
  is_active: boolean;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshAnnouncementsList: (page?: number, params?: { name?: string }) => void;
    announcementData: Announcement;
}

const EditModal = ({ isOpen, onClose, refreshAnnouncementsList, announcementData }: EditModalProps) => {
    const { data: session } = useSession() as { data: CustomSession };
    const t = useTranslations('AnnouncementsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [formData, setFormData] = useState({
        name: '',
        message: '',
        start_at: '',
        end_at: '',
        is_active: false,
    });

    useEffect(() => {
        if (announcementData) {
            const formatDate = (dateString: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setFormData({
                name: announcementData.name || '',
                message: announcementData.message || '',
                start_at: formatDate(announcementData.start_at),
                end_at: formatDate(announcementData.end_at),
                is_active: announcementData.is_active || false,
            });
        }
    }, [announcementData]);

    const handleSubmit = () => {
        const { name, message, start_at, end_at, is_active } = formData;
        console.log('Form Data:', formData);
        const schema = AnnouncementSchema(t_validation)
        
        const validation = schema.safeParse({ 
            name, 
            message, 
            start_at, 
            end_at, 
            is_active, 
        });
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        if (session?.user?.token) {
            editAnnouncement(
                session.user.token,
                announcementData.id,
                {
                    name,
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
                }
            }).catch(error => {
                toast.error(error.message);
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('edit_announcement')}</Modal.Header>
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
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: Boolean(e.target.checked) })}
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

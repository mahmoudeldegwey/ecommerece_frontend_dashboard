"use client";
import { Button, Label, Modal, TextInput, Select } from 'flowbite-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { createCoupon } from '@/utils/actions/coupons/actions';
import { toast } from 'react-toastify';
import { CouponSchema } from "@/utils/validationSchema";

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
    refreshCouponsList: (page?: number, params?: { name?: string }) => void;
}

const CreateModal = ({ isOpen, onClose, refreshCouponsList }: CreateModalProps) => {
    const { data: session } = useSession() as { data: CustomSession };
    const t = useTranslations('CouponsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        start_at: '',
        end_at: '',
        type: 'fixed',
        amount: '',
        max_usage: ''
    });

    const handleSubmit = () => {
        const { name, code, start_at, end_at, type, amount, max_usage } = formData;

        const schema = CouponSchema(t_validation)
        
        const validation = schema.safeParse({ name, code, start_at, end_at, type, amount: Number(amount), max_usage: Number(max_usage) });

        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        if (session?.user?.token) {
            createCoupon(
                session.user.token,
               { name,
                code,
                start_at,
                end_at,
                type: type as 'fixed' | 'percentage',
                amount:Number(amount),
                max_usage: Number(max_usage)}
            ).then(result => {
                if(result.message) {
                    toast.success(result.message);
                    refreshCouponsList();
                    onClose();
                    setFormData({
                        name: '',
                        code: '',
                        start_at: '',
                        end_at: '',
                        type: 'fixed',
                        amount: '',
                        max_usage: ''
                    });
                }
            }).catch(error => {
                toast.error(error.message);
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_coupon')}</Modal.Header>
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
                            <Label htmlFor="code" value={t('code')} />
                        </div>
                        <TextInput
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                            type="text"
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
                            <Label htmlFor="type" value={t('type')} />
                        </div>
                        <Select
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="fixed">{t('fixed')}</option>
                            <option value="percentage">{t('percentage')}</option>
                        </Select>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="amount" value={t('amount')} />
                        </div>
                        <TextInput
                            id="amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            type="number"
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="max_usage" value={t('max_usage')} />
                        </div>
                        <TextInput
                            id="max_usage"
                            value={formData.max_usage}
                            onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })}
                            required
                            type="number"
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

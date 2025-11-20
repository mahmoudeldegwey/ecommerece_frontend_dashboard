"use client";
import { Button, Label, Modal, TextInput, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { editCoupon } from '@/utils/actions/coupons/actions';
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

interface Coupon {
    id: number;
    name: string;
    code: string;
    start_at: string;
    end_at: string;
    type: 'fixed' | 'percentage';
    amount: number;
    usage: number;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshCouponsList: (page?: number, params?: { name?: string }) => void;
    couponData: Coupon;
}

const EditModal = ({ isOpen, onClose, refreshCouponsList, couponData }: EditModalProps) => {
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
        usage: ''
    });

    useEffect(() => {
        if (couponData) {
            const formatDate = (dateString: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setFormData({
                name: couponData.name || '',
                code: couponData.code || '',
                start_at: formatDate(couponData.start_at),
                end_at: formatDate(couponData.end_at),
                type: couponData.type || 'fixed',
                amount: couponData.amount?.toString() || '',
                usage: couponData.usage?.toString() || ''
            });
        }
    }, [couponData]);

    const handleSubmit = () => {
        const { name, code, start_at, end_at, type, amount, usage } = formData;

        const schema = CouponSchema(t_validation)
        
        const validation = schema.safeParse({ 
            name, 
            code, 
            start_at, 
            end_at, 
            type, 
            amount: Number(amount), 
            usage: Number(usage)
        });
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        if (session?.user?.token) {
            editCoupon(
                session.user.token,
                couponData.id,
                {
                    name,
                    code,
                    start_at,
                    end_at,
                    type,
                    amount: Number(amount),
                    usage: Number(usage)
                }
            ).then(result => {
                if(result.message) {
                    toast.success(result.message);
                    refreshCouponsList();
                    onClose();
                }
            }).catch(error => {
                toast.error(error.message);
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('edit_coupon')}</Modal.Header>
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
                            <option value="fixed">Fixed</option>
                            <option value="percentage">Percentage</option>
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
                            <Label htmlFor="usage" value={t('usage')} />
                        </div>
                        <TextInput
                            id="usage"
                            value={formData.usage}
                            onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                            required
                            type="number"
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

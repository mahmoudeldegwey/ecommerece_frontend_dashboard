"use client";
import { Button, FileInput, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { categoriesList, createCategory } from '@/utils/actions/categories/actions';
import { toast } from 'react-toastify';
import { CategorySchema } from "@/utils/validationSchema";

interface FormData {
    name: string;
    name_ar: string;
    parent_id: string;
    image: File | null;
}

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshCategoriesList: () => void;
}

const CreateModal = ({ isOpen, onClose, refreshCategoriesList }: CreateModalProps) => {
    const { data: session } = useSession();
    const t = useTranslations('CategoriesPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        name_ar: '',
        parent_id:'',
        image: null
    });

    const getCategories = async () => {
        categoriesList(session?.user?.token).then( result => {
            setCategories(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    useEffect(() => {
        if (session?.user?.token) {
            getCategories();
        }
    }, [session]);

    const handleSubmit = () => {

        const name = formData.name;
        const name_ar = formData.name_ar;

        const schema = CategorySchema(t_validation)
        
        const validation = schema.safeParse({ name , name_ar});
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        createCategory(
            session?.user?.token,
            formData.name,
            formData.name_ar,
            formData.parent_id,
            formData.image
        ).then((result: { message: string }) => {
            if(result.message) {
                toast.success(result.message);
                refreshCategoriesList();
                onClose();
                setFormData({
                    name: '',
                    name_ar: '',
                    parent_id: '',
                    image: null
                });
            }
        }).catch((error: Error) => {
            toast.error(error.message);
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_category')}</Modal.Header>
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
                        <Label>{t('parent_category')}</Label>
                        <Select id="parent_id"
                            onChange={(e) => setFormData({ ...formData, parent_id: Array.from(e.target.selectedOptions, (option) => Number(option.value)) })}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}                             
                        </Select>
                    </div>

                    <div>
                        <Label className="mb-2 block" htmlFor="file">
                        {t('image')}
                        </Label>
                        
                        <FileInput
                            id="file"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
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

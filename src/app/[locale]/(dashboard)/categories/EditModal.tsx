"use client";
import { Button, FileInput, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { categoriesList, editCategory } from '@/utils/actions/categories/actions';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    name_ar: string;
    parent_id: number;
    image: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshCategoriesList: () => void;
    categoryData: Category;
}

const EditModal = ({ isOpen, onClose, refreshCategoriesList, categoryData }: EditModalProps) => {
    const { data: session } = useSession();
    const t = useTranslations('CategoriesPage');
    const t_general = useTranslations('General');
    const [categories, setCategories] = useState([]);

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

    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
        parent_id: '',
        image: null as File | null
    });

    useEffect(() => {
        if (categoryData) {
            setFormData({
                name: categoryData.name || '',
                name_ar: categoryData.name_ar || '',
                parent_id: categoryData.parent_id || '',
            });
        }

    }, [categoryData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = () => {
        editCategory(
            session?.user?.token,
            categoryData.id,
            formData.name,
            formData.name_ar,
            formData.parent_id,
            formData.image
        ).then(result => {
            if(result.message) {
                toast.success(result.message);
                refreshCategoriesList();
                onClose();
            }
        }).catch(error => {
            toast.error(error.message);
        });
    };


    console.log(formData,'formData');

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('edit_category')}</Modal.Header>
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
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                        />
                        <div className="mt-2 text-right">
                            {formData.image && (
                                <Link
                                    href={formData.image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {t_general('image_link')}
                                </Link>
                            )}
                        </div>
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

"use client";
import { Button, Label, TextInput, Textarea, Checkbox, FileInput } from 'flowbite-react';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { productsList, createProduct } from '@/utils/actions/products/actions';
import { ProductsSchema } from "@/utils/validationSchema";
import { brandsList } from '@/utils/actions/brands/actions';
import { categoriesList } from '@/utils/actions/categories/actions';
import { colorsList } from '@/utils/actions/colors/actions';
import { sizesList } from '@/utils/actions/sizes/actions';

interface CustomSession {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        token?: string;
    };
}

interface Brand {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Color {
    id: number;
    name: string;
}

interface Size {
    id: number;
    name: string;
}

interface Product {
    name: string,
    name_ar: string,
    description: string,
    description_ar:string,
    price: string,
    sale_price: string,
    quantity: number,
    brand_id: number,
    has_free_shipping: boolean,
    has_multi_color: boolean,
    has_multi_size: boolean,
    sku: string,
    categories: Array<number>,
    colors: Array<number>,
    sizes: Array<number>,
    main_image: null|File
}


const CreatePage = () => {
    const { data: session } = useSession() as { data: CustomSession };
    const t = useTranslations('ProductsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [formData, setFormData] = useState<Product[]>({
        name: '',
        name_ar: '',
        description: '',
        description_ar: '',
        price: '',
        sale_price: '',
        quantity: 0,
        brand_id: 0,
        has_free_shipping: false,
        has_multi_color: false,
        has_multi_size: false,
        sku: '',
        categories: [] as number[],
        colors: [] as number[],
        sizes: [] as number[],
        main_image: null as File | null
    });

    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    const handleSubmit = () => {
        // Validation will go here
        if (session?.user?.token) {
            
            const schema = ProductsSchema(t_validation)
            console.log(formData,'schema page')
            const validation = schema.safeParse(formData);
        
            if (!validation.success) {
                toast.error(validation.error.errors[0].message);
                return;
            }
            
            createProduct(session?.user?.token, formData).then((result: { message: string }) => {
                if (result.message) {
                    toast.success(result.message);
                    setFormData({
                        name: '',
                        name_ar: '',
                        description: '',
                        description_ar: '',
                        price: '',
                        sale_price: '',
                        quantity: 0,
                        brand_id: '',
                        has_free_shipping: false,
                        has_multi_color: false,
                        has_multi_size: false,
                        sku: '',
                        categories: [] as number[],
                        colors: [] as number[],
                        sizes: [] as number[],
                        main_image: null as File | null
                    });
                }
            }).catch((error: Error) => {
                toast.error(error.message);
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, main_image: e.target.files[0] });
        }
    };

    const getBrands = async () => {
        brandsList(session?.user?.token).then( result => {
            setBrands(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    const getCategories = async () => {
        categoriesList(session?.user?.token).then( result => {
            setCategories(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }   

    const getColors = async () => {
        colorsList(session?.user?.token).then( result => {
            setColors(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    const getSizes = async () => {
        sizesList(session?.user?.token).then( result => {
            setSizes(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    } 

    useEffect(() => {
        if (session?.user?.token) {
            getBrands();
            getCategories();
            getColors(); 
            getSizes(); 
        }
    }, [session]);

    return (
        <div className="w-full p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold mb-6">{t('create_product')}</h1>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name" value={t_general('name')} />
                        <TextInput
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="name_ar" value={t_general('name_ar')} />
                        <TextInput
                            id="name_ar"
                            value={formData.name_ar}
                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="description" value={t('description')} />
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                        />
                    </div>
                    <div>
                        <Label htmlFor="description_ar" value={t('description_ar')} />
                        <Textarea
                            id="description_ar"
                            value={formData.description_ar}
                            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                            required
                            rows={4}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="price" value={t('price')} />
                        <TextInput
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="sale_price" value={t('sale_price')} />
                        <TextInput
                            id="sale_price"
                            type="number"
                            step="0.01"
                            value={formData.sale_price}
                            onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="quantity" value={t('quantity')} />
                        <TextInput
                            id="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="brand_id" value={t('brand')} />
                    <Select
                        value={brands.find(b => b.id === formData.brand_id) ? { value: formData.brand_id, label: brands.find(b => b.id === formData.brand_id)?.name } : null}
                        onChange={(e) => setFormData({ ...formData, brand_id: Number(e.value) })}
                        options={brands.map(brand => ({
                            value: brand.id,
                            label: brand.name
                        }))}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center">
                        <Checkbox
                            id="has_free_shipping"
                            checked={formData.has_free_shipping}
                            onChange={(e) => setFormData({ ...formData, has_free_shipping: e.target.checked })}
                        />
                        <Label htmlFor="has_free_shipping" className="ml-2">{t('has_free_shipping')}</Label>
                    </div>
                    <div className="flex items-center">
                        <Checkbox
                            id="has_multi_color"
                            checked={formData.has_multi_color}
                            onChange={(e) => setFormData({ ...formData, has_multi_color: e.target.checked })}
                        />
                        <Label htmlFor="has_multi_color" className="ml-2">{t('has_multi_color')}</Label>
                    </div>
                    <div className="flex items-center">
                        <Checkbox
                            id="has_multi_size"
                            checked={formData.has_multi_size}
                            onChange={(e) => setFormData({ ...formData, has_multi_size: e.target.checked })}
                        />
                        <Label htmlFor="has_multi_size" className="ml-2">{t('has_multi_size')}</Label>
                    </div>
                </div>

                <div>
                    <Label htmlFor="sku" value={t('sku')} />
                    <TextInput
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="categories" value={t('categories')} />
                    <Select
                        id="categories"
                        isMulti
                        value={categories.filter(cat => formData.categories.includes(cat.id)).map(cat => ({
                            value: cat.id,
                            label: cat.name
                        }))}
                        onChange={(selectedOptions) => {
                            const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                            setFormData({ ...formData, categories: selectedIds });
                        }}
                        options={categories.map(category => ({
                            value: category.id,
                            label: category.name
                        }))}
                        className="mt-1"
                        classNamePrefix="select"
                    />
                </div>

                {formData.has_multi_color && (
                    <div>
                        <Label htmlFor="colors" value={t('colors')} />
                        <Select
                            id="colors"
                            isMulti
                            value={colors.filter(col => formData.colors.includes(col.id)).map(col => ({
                                value: col.id,
                                label: col.name
                            }))}
                            onChange={(selectedOptions) => {
                                const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                setFormData({ ...formData, colors: selectedIds });
                            }}
                            options={colors.map(color => ({
                                value: color.id,
                                label: color.name
                            }))}
                            className="mt-1"
                            classNamePrefix="select"
                        />
                    </div>
                )}

                {formData.has_multi_size && (
                    <div>
                        <Label htmlFor="sizes" value={t('sizes')} />
                        <Select
                            id="sizes"
                            isMulti
                            value={sizes.filter(size => formData.sizes.includes(size.id)).map(size => ({
                                value: size.id,
                                label: size.name
                            }))}
                            onChange={(selectedOptions) => {
                                const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                setFormData({ ...formData, sizes: selectedIds });
                            }}
                            options={sizes.map(size => ({
                                value: size.id,
                                label: size.name
                            }))}
                            className="mt-1"
                            classNamePrefix="select"
                        />
                    </div>
                )}

                <div>
                    <Label htmlFor="main_image" value={t('main_image')} />
                    <FileInput
                        id="main_image"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={handleSubmit} type="submit">{t_general('create')}</Button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default CreatePage;

"use client";


import { Button, Label, TextInput, Textarea, Checkbox, FileInput } from 'flowbite-react';
import { useState,useEffect } from 'react';
import { getProduct, updateProduct } from '@/utils/actions/products/actions';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { brandsList } from '@/utils/actions/brands/actions';
import { categoriesList } from '@/utils/actions/categories/actions';
import { colorsList } from '@/utils/actions/colors/actions';
import { sizesList } from '@/utils/actions/sizes/actions';
import parsePrice from "@/utils/helpers";
import Select from 'react-select';
import { ProductsSchema } from "@/utils/validationSchema";
import { toast } from 'react-toastify';

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
    main_image: null|File,
    brand?: Brand
}

export default function EditFormGeneralInfo({id}: {id: number}) {

    const { data: session } = useSession();
    const token = session?.user?.token;

    const t = useTranslations('EditProduct');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    
    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, main_image: e.target.files[0] });
        }
    };

    const [formData, setFormData] = useState<Product[]>({
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
        main_image: null as File | null,
        brand: {
            id: 0,
            name: ''
        }
    });

    const getBrands = async () => {
        brandsList(token).then( result => {
            setBrands(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    const getCategories = async () => {
        categoriesList(token).then( result => {
            setCategories(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }   

    const getColors = async () => {
        colorsList(token).then( result => {
            console.log(result.data,'colors result')
            setColors(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    const getSizes = async () => {
        sizesList(token).then( result => {
            setSizes(result.data);
        }).catch(error => {
            throw new Error(`HTTP error! Status:`);
        })
    }

    useEffect(() => {
        if (token) {
            getProduct(token, id).then(result => {
                setFormData({...formData, 
                    brand_id: result.brand.id, 
                    categories: result.categories.map((cat:Category) => cat.id), 
                    colors: result.colors.map((col:Color) => col.id), 
                    sizes: result.sizes.map((size:Size) => size.id), 
                    name: result.name, 
                    name_ar: result.name_ar, 
                    description: result.description, 
                    description_ar: result.description_ar, 
                    price: result.price, 
                    sale_price: result.sale_price, 
                    quantity: result.quantity, 
                    has_free_shipping: result.has_free_shipping, 
                    has_multi_color: result.has_multi_color, 
                    has_multi_size: result.has_multi_size, 
                    sku: result.sku, 
                    brand: result.brand   
                });
            })
            getBrands();
            getCategories();
            getColors();
            getSizes();
        }
    },[id,session])

    const handleSubmit = () => {
        // Validation will go here
        if (token) {

            const schema = ProductsSchema(t_validation)
            
            const validation = schema.safeParse(formData);
        
            if (!validation.success) {
                toast.error(validation.error.errors[0].message);
                return;
            } 
            console.log('Validation succeeded:', formData);
            updateProduct(token, id , {
                name: formData.name,
                name_ar: formData.name_ar,
                description: formData.description,
                description_ar: formData.description_ar,
                price: parsePrice(formData.price),
                sale_price: parsePrice(formData.sale_price),
                quantity: formData.quantity,
                brand_id: formData.brand_id,
                has_free_shipping: formData.has_free_shipping,
                has_multi_color: formData.has_multi_color,
                has_multi_size: formData.has_multi_size,
                categories: formData.categories,
                colors: formData.colors,
                sizes: formData.sizes,
                main_image: formData.main_image
            }).then((result: { message: string }) => {
                if (result.message) {
                    toast.success(result.message);
                }
            }).catch((error: Error) => {
                console.error(error, 'error in updateProduct here');
                toast.error(error.message);
            });
        }
    };

    return (
        <div>
            <div className='row'>
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
            </div>
            <div className='row'>
                <div className="grid grid-cols-2 gap-4 mt-5">
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
            </div>
            <div className="row">
                <div className="grid grid-cols-3 gap-4 mt-5">
                    <div>
                        <Label htmlFor="price" value={t('price')} />
                        <TextInput
                            id="price"
                            type="number"
                            step="0.01"
                            value={Number(parsePrice(formData.price))}
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
                            value={Number(parsePrice(formData.sale_price))}
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
            </div>
            <div className="row">
                <div className="mt-5">
                    <Label htmlFor="brand_id" value={t('brand')} />
                    <Select
                        value={
                            formData.brand_id
                            ? {
                                value: formData.brand_id,
                                label: brands.find((b) => b.id === formData.brand_id)?.name || "",
                                }
                            : null
                        }
                        onChange={(selected) =>
                            setFormData({
                            ...formData,
                            brand_id: selected ? Number(selected.value) : 0,
                            })
                        }
                        options={brands.map((brand) => ({
                            value: brand.id,
                            label: brand.name,
                        }))}
                        placeholder="Select brand..."
                    />
                </div>
            </div>

            <div className="row">
                <div className="grid grid-cols-3 gap-4 mt-5">
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
            </div>

            {/* <div className="row">
                <div className="mt-5">
                    <Label htmlFor="sku" value={t('sku')} />
                    <TextInput
                        id="sku"
                        value={typeof formData.sku === 'string' ? formData.sku : '' }
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                    />
                </div>
            </div> */}

            <div className="row">
                <div className="mt-5">
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
            </div>
            
            {formData.has_multi_color && (
                <div className="row">               
                    <div className="mt-5">
                        <Label htmlFor="colors" value={t('colors')} />
                        <Select
                            id="colors"
                            isMulti
                            value={colors.filter(col => formData.colors.includes(col.id)).map(col => ({
                                value: col.id,
                                label: col.name
                            }))}
                            options={colors.map(col => ({
                                value: col.id,
                                label: col.name
                            }))}
                            onChange={(selectedOptions) => {
                                const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                setFormData({ ...formData, colors: selectedIds });
                            }}
                            
                            className="mt-1"
                            classNamePrefix="select"
                        />
                    </div>  
                </div>
            )}

            {formData.has_multi_size && (
                <div className="row">               
                    <div className="mt-5">
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
                </div>
            )}

            <div className="row ">
                <div className="mt-5">
                    <Label htmlFor="main_image" value={t('main_image')} />
                    <FileInput
                        id="main_image"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                    />
                </div>
            </div>

            <div className="row ">
                <div className="mt-5">
                <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={handleSubmit} type="submit">{t_general('update')}</Button>
                </div>
                </div>
            </div>

        </div>
    );
}
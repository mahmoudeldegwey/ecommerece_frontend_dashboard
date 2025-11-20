"use client";
import { Button, Label, TextInput, Textarea, Checkbox, FileInput } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { useState,useEffect } from 'react';
import React from 'react';
import {uploadImage} from '@/utils/actions/upload-images/action';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct } from '@/utils/actions/products/actions';

export default function UploadProductImages({id}: {id: number}) {
    
    const t = useTranslations('UploadProductImages');
    const session = useSession();

    const [productData, setProductData] = useState();

    const [formData, setFormData] = useState({
        model_id: id,
        model_type: 'product',
        destination: 'products',
        file: null as File | null
    });

    const [imagesUrls, setImagesUrls] = useState<string[]>([]); 

    useEffect(() => {
        if (session?.data?.user?.token) {
            getProduct(session?.data?.user?.token, id).then(result => {
                setProductData(result)
                if (result.images) {
                    setImagesUrls(result.images.map((image: { url: string }) => image.url));
                }
                //setImagesUrls(result.images || []);
            })
        }
    },[id,session])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });

            const response = await uploadImage(session?.data?.user?.token,formData)
            
            setImagesUrls(prev => [...prev, response.data.url]);
            toast.success(t('imageUploaded'))
        }
        
    };
    
    return (
        <div>
            <div className="row">
                <div className="mt-5">
                    <Label htmlFor="file" value={t('file')} />
                    <FileInput
                        id="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                    />
                </div>
            </div>
            <div className='row'>
                <div className='mt-5'>
                    
                    { 
                        imagesUrls.length > 0 ? (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                            {imagesUrls.map((url, index) => (
                                <div key={index} className="relative w-[150px] h-[150px]">
                                <Image
                                    src={url}
                                    alt={`Image ${index}`}
                                    fill
                                    className="p-2 object-cover rounded border-spacing-5 border border-gray-300"
                                />
                                </div>
                            ))}
                            </div>
                        ) : (
                            <p className="text-center">{t('noImages')}</p>
                        )
                        }

                    </div>
            </div>
        </div>
    );
}
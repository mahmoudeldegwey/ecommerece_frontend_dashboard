"use client";
import { Button, Spinner } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { uploadImage, deleteImage } from '@/utils/actions/upload-images/action';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { getProduct } from '@/utils/actions/products/actions';
import { HiOutlineUpload, HiOutlineTrash, HiOutlinePhotograph, HiX } from 'react-icons/hi';

interface ImageData {
    id: string | number;
    url: string;
}

export default function UploadProductImages({ id }: { id: number }) {
    const t = useTranslations('UploadProductImages');
    const session = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [productData, setProductData] = useState<any>();
    const [images, setImages] = useState<ImageData[]>([]);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | number | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const [formData, setFormData] = useState({
        model_id: id,
        model_type: 'product',
        destination: 'products',
        file: null as File | null
    });

    useEffect(() => {
        if (session?.data?.user?.token) {
            getProduct(session?.data?.user?.token, id).then(result => {
                setProductData(result);
                if (result.images) {
                    setImages(result.images.map((image: any) => ({
                        id: image.id,
                        url: image.url
                    })));
                }
            });
        }
    }, [id, session]);

    const handleFileChange = async (file: File) => {
        if (!file) return;

        const updatedFormData = { ...formData, file };
        setUploading(true);

        try {
            const response = await uploadImage(session?.data?.user?.token, updatedFormData);
            setImages(prev => [...prev, { id: response.data.id, url: response.data.url }]);
            toast.success(t('imageUploaded'));
        } catch (error) {
            toast.error('Failed to upload image');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleFileChange(e.target.files[0]);
        }
    };

    const handleDeleteImage = async (imageId: string | number) => {
        const token = session?.data?.user?.token; 
        setDeletingId(imageId);
        try {
            const result = await deleteImage(token, imageId, 'products');
            setImages(prev => prev.filter(img => img.id !== imageId));
            
            toast.success('Image deleted successfully');

        } catch (error) {
            toast.error('Failed to delete image');
            console.error('Delete error:', error);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlinePhotograph className="w-5 h-5" />
                    {t('file') || 'Upload Product Images'}
                </h3>

                {/* Drag & Drop Zone */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`
                        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                        transition-all duration-200 ease-in-out
                        ${dragActive 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-700/50'
                        }
                        ${uploading ? 'pointer-events-none opacity-50' : ''}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Spinner size="lg" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Uploading image...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <HiOutlineUpload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    PNG, JPG, JPEG, WEBP up to 10MB
                                </p>
                            </div>
                            <Button color="blue" size="sm" className="mt-2">
                                <HiOutlineUpload className="w-4 h-4 mr-2" />
                                Choose File
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Images Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Uploaded Images ({images.length})
                    </h3>
                </div>

                {images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
                            >
                                <Image
                                    src={image.url}
                                    alt={`Product image ${image.id}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                />

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Button
                                            color="failure"
                                            size="sm"
                                            onClick={() => handleDeleteImage(image.id)}
                                            disabled={deletingId === image.id}
                                            className="shadow-lg"
                                        >
                                            {deletingId === image.id ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                <>
                                                    <HiOutlineTrash className="w-4 h-4 mr-1" />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Delete Button Badge */}
                                <button
                                    onClick={() => handleDeleteImage(image.id)}
                                    disabled={deletingId === image.id}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10"
                                >
                                    {deletingId === image.id ? (
                                        <Spinner size="xs" color="white" />
                                    ) : (
                                        <HiX className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <HiOutlinePhotograph className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {t('noImages') || 'No images uploaded yet'}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Upload your first image to get started
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";
import { useState } from "react";
import { 
    Checkbox, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeadCell, 
    TableRow, 
    Button, 
    TextInput,
    Label,
    Select
} from "flowbite-react";

import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import { redirect } from "next/navigation";
import { toUpperCase } from "../../../../../nextjs-test/_node_modules/uri-js/dist/esnext/util";
import { approveProductReview,deleteProductReview } from '@/utils/actions/product-reviews/actions'

interface ProductReview {
  id: number;
  username: string;
  phone_number: string;
  email: string;
  image: string;
  rate: string;
  message: string;
  created_at: string;
  status: string;
  product?: {
    id: number;
    name: string;
  };
}

interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface CustomSession {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        token?: string;
    };
}

interface ListTableProps {
    productReviews: ProductReview[];
    meta: Meta;
    refreshProductReviewsList: (page?: number, params?: { name?: string }) => void;
}

const ListTable = ({productReviews, meta, refreshProductReviewsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };
    const locale = useLocale();

    const t = useTranslations('productReviewsPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [selectedAllProductReviews, setSelectedAllProductReviews] = useState<number[]>([]);

    const isAllChecked = selectedAllProductReviews.length === productReviews.length && productReviews.length > 0;

    const currentLocale = useLocale();

    const handleDelete = (id: number) => {
        deleteProductReview(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshProductReviewsList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllProductReviews,'selectedAllProductReviews')
    }

    const handleApprove = (id: number) => {
        approveProductReview(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshProductReviewsList()
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllProductReviews([]); // Unselect all
        } else {
            const ids = productReviews.map(order => order.id); // Get all IDs
            setSelectedAllProductReviews(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllProductReviews(IncludeID)   ;
    };
    
    const productReviewsSearch = () => {
        refreshProductReviewsList(1, {name: searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_reviews')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button className="ml-2" onClick={() => productReviewsSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
               
            </div>

            {/* Table */}
            <Table hoverable>
                <TableHead>
                    <TableHeadCell className="p-4">
                        <Checkbox checked={isAllChecked} onChange={() => handleSelectAllCheckBox()} />
                    </TableHeadCell>
                    <TableHeadCell>{t("username")}</TableHeadCell>
                    <TableHeadCell>{t("phone_number")}</TableHeadCell>
                    <TableHeadCell>{t("email")}</TableHeadCell>
                    <TableHeadCell>{t("message")}</TableHeadCell>
                    <TableHeadCell>{t("rate")}</TableHeadCell>
                    <TableHeadCell>{t("image")}</TableHeadCell>
                    <TableHeadCell>{t("status")}</TableHeadCell>
                    <TableHeadCell>{t("product")}</TableHeadCell>
                    <TableHeadCell>{t("created_at")}</TableHeadCell>
                    <TableHeadCell>{t_general("actions")}</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {productReviews.length > 0 ? (
                        productReviews.map((item) => (
                            <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        checked={selectedAllProductReviews.includes(item.id)} 
                                        onChange={() => handleSelectCheckBox(item.id)} 
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {/* <Link href={`/${locale}/order-details/${item.id}`} className="text-blue-600 hover:underline">
                                        
                                    </Link> */}
                                    {item.username}
                                </TableCell>
                               <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.phone_number}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.email}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.message}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.rate}
                                </TableCell>
                                 <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    <Link href={item.image} target="_blank" className="text-blue-600 hover:underline">
                                        {t('view_image')}    
                                    </Link>
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {toUpperCase(item.status)}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    <Link href={`/${currentLocale}/products/${item?.product?.id}`} target="_blank" className="text-blue-600 hover:underline">
                                        {item?.product?.name}   
                                    </Link>
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    {item.status !== 'active' && (
                                        <Button size="xs" color="blue" onClick={() => handleApprove(item.id)}>{t('approve')}</Button>      
                                    )}
                                    
                                    <Button size="xs" color="red" onClick={() => handleDelete(item.id)}>{t_general('delete')}</Button>    
                                    
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center p-4">
                                {t('no_product_reviews_found')}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshProductReviewsList}
                />
            </div>
        </div>
    );
};

export default ListTable;

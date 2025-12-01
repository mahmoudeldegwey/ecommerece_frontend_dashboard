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
    Select,
    Badge
} from "flowbite-react";

import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import { approveProductReview,deleteProductReview } from '@/utils/actions/product-reviews/actions'
import { HiSearch, HiFilter, HiX, HiAdjustments } from "react-icons/hi";

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
    refreshProductReviewsList: (page?: number, params?: any) => void;
}

const ListTable = ({productReviews, meta, refreshProductReviewsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };
    const locale = useLocale();

    const t = useTranslations('productReviewsPage');
    const t_general = useTranslations('General');

    const [selectedAllProductReviews, setSelectedAllProductReviews] = useState<number[]>([]);

    // Filter states
    const [filters, setFilters] = useState({
        search_key: '',
        status: ''
    });

    const [showFilters, setShowFilters] = useState(false);

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
    
   const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params: any = {};
        
        if (filters.search_key) params.search_key = filters.search_key;
        if (filters.status) params.status = filters.status;
        
        refreshProductReviewsList(1, params);
    };

    const clearFilters = () => {
        setFilters({
            search_key: '',
            status: ''
        });
        refreshProductReviewsList(1, {});
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.status) count++;
        return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <div className="p-4 space-y-4">
            <Breadcrumb />
           {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 flex gap-2">
                        <div className="relative flex-1 max-w-md">
                            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <TextInput 
                                className="pl-10"
                                placeholder={t('search_product_reviews') || "Search product reviews by product, username..."}
                                value={filters.search_key}
                                onChange={(e) => handleFilterChange('search_key', e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </div>
                        
                        <Button color="blue" onClick={applyFilters}>
                            <HiSearch className="w-4 h-4 mr-2" />
                            {t_general('search') || 'Search'}
                        </Button>
                        
                        <Button 
                            color="gray" 
                            onClick={() => setShowFilters(!showFilters)}
                            className="relative"
                        >
                            <HiAdjustments className="w-4 h-4 mr-2" />
                            {t_general('filters') || 'Filters'}
                            {activeFiltersCount > 0 && (
                                <Badge color="red" className="ml-2 absolute -top-2 -right-2">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </div>

                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Status */}
                            <div>
                                <Label htmlFor="status" value={t("status") || "status"} className="mb-2" />
                                <Select
                                    id="status"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="pending">pending</option>
                                    <option value="active">active</option>
                                </Select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex gap-2 mt-4">
                            <Button color="blue" size="sm" onClick={applyFilters}>
                                <HiFilter className="w-4 h-4 mr-2" />
                                Apply Filters
                            </Button>
                            <Button color="gray" size="sm" onClick={clearFilters}>
                                <HiX className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </div>
                )}

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                        {filters.search_key && (
                            <Badge color="info">
                                Search: {filters.search_key}
                                <button onClick={() => handleFilterChange('search_key', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.status && (
                            <Badge color="info">
                                status: {filters.status}
                                <button onClick={() => handleFilterChange('status', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
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
                                            {item.status.toUpperCase()}
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
                </div>
            </div>

            {/* Pagination */}
            {productReviews.length > 0 && (
                <div className="flex justify-center mt-4">
                    <Pagination 
                        meta={meta}
                        handlePageChange={refreshProductReviewsList}
                    />
                </div>
            )}
        </div>
    );
};

export default ListTable;

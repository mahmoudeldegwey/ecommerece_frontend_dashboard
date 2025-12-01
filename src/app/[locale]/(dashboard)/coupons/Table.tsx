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

import CreateModal from "./CreateModal";
import EditModal from "./EditModal";

import {useTranslations} from 'next-intl';
import {deleteCoupon, getCoupon} from '@/utils/actions/coupons/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import { HiSearch, HiFilter, HiX, HiAdjustments } from "react-icons/hi";
import Link from "next/link";

interface Coupon {
    id: number;
    name: string;
    name_ar: string;
    code: string;
    start_at: string;
    end_at: string;
    type: 'fixed' | 'percentage';
    amount: number;
    usage: number;
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
    coupons: Coupon[];
    meta: Meta;
    refreshCouponsList: (page?: number, params?: { name?: string }) => void;
}

const ListTable = ({coupons, meta, refreshCouponsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };

    const t = useTranslations('CouponsPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [couponData, setCouponData] = useState({
        id: 0,
        name: '',
        name_ar: '',
        code: '',
        start_at: '',
        end_at: '',
        type: 'fixed',
        amount: 0,
        usage: 0
    });

    const [selectedAllCoupons, setSelectedAllCoupons] = useState<number[]>([]);
    
    // Filter states
    const [filters, setFilters] = useState({
        name: '',
        code: '',
        type: ''
    });

    const [showFilters, setShowFilters] = useState(false);

    const isAllChecked = selectedAllCoupons.length === coupons.length && coupons.length > 0;

    const handleDelete = (id: number) => {
        deleteCoupon(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshCouponsList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllCoupons,'selectedAllCoupons')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        getCoupon(session?.user?.token, id).then(result => {
            setCouponData(result.data)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllCoupons([]); // Unselect all
        } else {
            const ids = coupons.map(coupon => coupon.id); // Get all IDs
            setSelectedAllCoupons(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllCoupons(IncludeID);
    };
    
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params: any = {};
        
        if (filters.name) params.name = filters.name;
        if (filters.code) params.code = filters.code;
        if (filters.type) params.type = filters.type;
        
        refreshCouponsList(1, params);
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            code: '',
            type: ''
        });
        refreshCouponsList(1, {});
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.name) count++;
        if (filters.code) count++;
        if (filters.type) count++;
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
                                placeholder={t('search_coupon') }
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        
                        {selectedAllCoupons.length > 0 && (
                        <button 
                            onClick={() => handleAllDelete()} 
                            className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 border border-red-600"
                        >
                            {t_general('delete')} ({selectedAllCoupons.length})
                        </button>
                        )}

                        <Link href="#" onClick={() => setIsModalOpen(true)} 
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                            {t('create_coupon')}
                        </Link>
                        
                    </div>

                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Code */}
                            <div>
                                <Label htmlFor="code" value={t("code") || "code"} className="mb-2" />
                                <TextInput 
                                    className="pl-10"
                                    placeholder={t('code') }
                                    value={filters.code}
                                    onChange={(e) => handleFilterChange('code', e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>

                            {/* type */}
                            <div>
                                <Label htmlFor="type" value={t("type") || "type"} className="mb-2" />
                                <Select
                                    id="type"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="fixed">{t('fixed')}</option>
                                    <option value="percentage">{t('percentage')}</option>
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
                        
                        {filters.code && (
                            <Badge color="info">
                                {t("code")}: {filters.code}
                                <button onClick={() => handleFilterChange('code', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}

                        {filters.type && (
                            <Badge color="info">
                                {t("type")}: {filters.type}
                                <button onClick={() => handleFilterChange('type', '')} className="ml-1">
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
                            <TableHeadCell>{t_general("name")}</TableHeadCell>
                            <TableHeadCell>{t("code")}</TableHeadCell>
                            <TableHeadCell>{t("start_at")}</TableHeadCell>
                            <TableHeadCell>{t("end_at")}</TableHeadCell>
                            <TableHeadCell>{t("type")}</TableHeadCell>
                            <TableHeadCell>{t("amount")}</TableHeadCell>
                            <TableHeadCell>{t("usage")}</TableHeadCell>
                            <TableHeadCell>{t_general("actions")}</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {coupons.length > 0 ? (
                                coupons.map((item) => (
                                    <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell className="p-4">
                                            <Checkbox 
                                                checked={selectedAllCoupons.includes(item.id)} 
                                                onChange={() => handleSelectCheckBox(item.id)} 
                                            />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </TableCell>
                                    
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.code}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {new Date(item.start_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {new Date(item.end_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.type}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.amount}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.usage}
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button size="xs" color="blue" onClick={() => handleEdit(item.id)}>{t_general('edit')}</Button>
                                            <Button size="xs" color="red" onClick={() => handleDelete(item.id)}>{t_general('delete')}</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center p-4">
                                        {t('no_coupons_found')}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {coupons.length > 0 && (
                <div className="flex justify-center mt-4">
                    <Pagination 
                        meta={meta}
                        handlePageChange={refreshCouponsList}
                    />
                </div>
            )}

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshCouponsList={refreshCouponsList}
            />

           {/* Edit Modal */}
           <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshCouponsList={refreshCouponsList}
                couponData={couponData}
            />
        </div>
    );
};

export default ListTable;

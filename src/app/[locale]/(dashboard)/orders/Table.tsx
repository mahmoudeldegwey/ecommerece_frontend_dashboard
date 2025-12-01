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
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

import { 
    HiSearch, 
    HiFilter, 
    HiX, 
    HiAdjustments 
} from "react-icons/hi";

interface Order {
    id: number;
    order_number: string;
    total_price: number;
    final_cost: number;
    products_count: number;
    products_quantity: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    customer_name: string;
    customer_phone: string;
    payment_method: string;
    shipping_cost: number;
    country: string;
    city: string;
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
    orders: Order[];
    meta: Meta;
    refreshOrdersList: (page?: number, params?: any) => void;
}

const ListTable = ({orders, meta, refreshOrdersList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };
    const locale = useLocale();

    const t = useTranslations('OrdersPage');
    const t_general = useTranslations('General');

    const [selectedAllOrders, setSelectedAllOrders] = useState<number[]>([]);

    // Filter states
    const [filters, setFilters] = useState({
        order_number: '',
        customer_name: '',
        customer_phone: '',
        status: ''
    });

    const [showFilters, setShowFilters] = useState(false);

    const isAllChecked = selectedAllOrders.length === orders.length && orders.length > 0;

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllOrders([]); // Unselect all
        } else {
            const ids = orders.map(order => order.id); // Get all IDs
            setSelectedAllOrders(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllOrders(IncludeID)   ;
    };
    
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params: any = {};
        
        if (filters.order_number) params.order_number = filters.order_number;
        if (filters.customer_name) params.customer_name = filters.customer_name;
        if (filters.customer_phone) params.customer_phone = filters.customer_phone;
        if (filters.status) params.status = filters.status;
        
        refreshOrdersList(1, params);
    };

    const clearFilters = () => {
        setFilters({
            order_number: '',
            customer_name: '',
            customer_phone: '',
            status: ''
        });
        refreshOrdersList(1, {});
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.order_number) count++;
        if (filters.customer_name) count++;
        if (filters.customer_phone) count++;
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
                                placeholder={t('search_orders') || "Search by order number"}
                                value={filters.order_number}
                                onChange={(e) => handleFilterChange('order_number', e.target.value)}
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
                            {/* customer_name */}
                            <div>
                                <Label htmlFor="customer_name" value={t("customer_name") || "Customer Name"} className="mb-2" />
                                <TextInput
                                    id="customer_name"
                                    placeholder={t("customer_name") || "Customer Name"}
                                    value={filters.customer_name}
                                    onChange={(e) => handleFilterChange('customer_name', e.target.value)}
                                />
                            </div>

                            {/* customer_phone */}
                            <div>
                                <Label htmlFor="customer_phone" value={t("customer_phone") || "Customer Phone"} className="mb-2" />
                                <TextInput
                                    id="customer_phone"
                                    placeholder={t("customer_phone") || "Customer Phone"}
                                    value={filters.customer_phone}
                                    onChange={(e) => handleFilterChange('customer_phone', e.target.value)}
                                />
                            </div>

                            {/* Order Status */}
                            <div>
                                <Label htmlFor="order_status" value={t("order_status") || "order status"} className="mb-2" />
                                <Select
                                    id="order_status"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="pending">pending</option>
                                    <option value="confirmed">confirmed</option>
                                    <option value="shipped">shipped</option>
                                    <option value="delivered">delivered</option>
                                    <option value="cancelled">cancelled</option>
                                    <option value="refunded">refunded</option>
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
                        {filters.order_number && (
                            <Badge color="info">
                                Order Number: {filters.order_number}
                                <button onClick={() => handleFilterChange('order_number', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.customer_name && (
                            <Badge color="info">
                                Customer Name: {filters.customer_name}
                                <button onClick={() => handleFilterChange('customer_name', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.customer_phone && (
                            <Badge color="info">
                                Customer Phone: {filters.customer_phone}
                                <button onClick={() => handleFilterChange('customer_phone', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.status && (
                            <Badge color="info">
                                Status: {filters.status}
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
                            <TableHeadCell>{t("order_number")}</TableHeadCell>
                            <TableHeadCell>{t("total_price")}</TableHeadCell>
                            <TableHeadCell>{t("final_cost")}</TableHeadCell>
                            <TableHeadCell>{t("products_count")}</TableHeadCell>
                            {/* <TableHeadCell>{t("products_quantity")}</TableHeadCell> */}
                            <TableHeadCell>{t("status")}</TableHeadCell>
                            <TableHeadCell>{t("customer_name")}</TableHeadCell>
                            <TableHeadCell>{t("customer_phone")}</TableHeadCell>
                            <TableHeadCell>{t("payment_method")}</TableHeadCell>
                            <TableHeadCell>{t("shipping_cost")}</TableHeadCell>
                            {/* <TableHeadCell>{t("country")}</TableHeadCell>
                            <TableHeadCell>{t("city")}</TableHeadCell> */}
                            <TableHeadCell>{t("created_at")}</TableHeadCell>
                            <TableHeadCell>{t("updated_at")}</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {orders.length > 0 ? (
                                orders.map((item) => (
                                    <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell className="p-4">
                                            <Checkbox 
                                                checked={selectedAllOrders.includes(item.id)} 
                                                onChange={() => handleSelectCheckBox(item.id)} 
                                            />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <Link href={`/${locale}/order-details/${item.id}`} className="text-blue-600 hover:underline">
                                                {item.order_number}
                                            </Link>
                                        </TableCell>
                                    
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.total_price}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.final_cost}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.products_count}
                                        </TableCell>
                                        {/* <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.products_quantity}
                                        </TableCell> */}
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.status}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.customer_name }
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.customer_phone }
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.payment_method }
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.shipping_cost }
                                        </TableCell>
                                        {/* <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.country?.name }
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.city?.name }
                                        </TableCell> */}
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.updated_at ? new Date(item.updated_at).toLocaleString() : ""}
                                        </TableCell>
                                        
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center p-4">
                                        {t('no_orders_found')}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {orders.length > 0 && (
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshOrdersList}
                />
            </div>
            )}


        </div>
    );
};

export default ListTable;

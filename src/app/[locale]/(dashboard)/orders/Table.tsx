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
import {deleteProduct, getProduct} from '@/utils/actions/products/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import { redirect } from "next/navigation";

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
    refreshOrdersList: (page?: number, params?: { name?: string }) => void;
}

const ListTable = ({orders, meta, refreshOrdersList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };
    const locale = useLocale();

    const t = useTranslations('OrdersPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [selectedAllOrders, setSelectedAllOrders] = useState<number[]>([]);

    const isAllChecked = selectedAllOrders.length === orders.length && orders.length > 0;

    const handleDelete = (id: number) => {
        deleteProduct(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshOrdersList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllOrders,'selectedAllProducts')
    }

    const handleEdit = (id: number) => {
        redirect(`/${locale}/orders/${id}`)
    }

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
    
    const orderSearch = () => {
        refreshOrdersList(1, {name: searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_orders')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button className="ml-2" onClick={() => orderSearch()}>
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
                    <TableHeadCell>{t("order_number")}</TableHeadCell>
                    <TableHeadCell>{t("total_price")}</TableHeadCell>
                    <TableHeadCell>{t("final_cost")}</TableHeadCell>
                    <TableHeadCell>{t("products_count")}</TableHeadCell>
                    <TableHeadCell>{t("products_quantity")}</TableHeadCell>
                    <TableHeadCell>{t("status")}</TableHeadCell>
                    <TableHeadCell>{t("customer_name")}</TableHeadCell>
                    <TableHeadCell>{t("customer_phone")}</TableHeadCell>
                    <TableHeadCell>{t("payment_method")}</TableHeadCell>
                    <TableHeadCell>{t("shipping_cost")}</TableHeadCell>
                    <TableHeadCell>{t("country")}</TableHeadCell>
                    <TableHeadCell>{t("city")}</TableHeadCell>
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
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.products_quantity}
                                </TableCell>
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
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.country?.name }
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.city?.name }
                                </TableCell>
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

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshOrdersList}
                />
            </div>


        </div>
    );
};

export default ListTable;

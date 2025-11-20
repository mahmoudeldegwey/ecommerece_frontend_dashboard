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

interface Product {
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
    products: Product[];
    meta: Meta;
    refreshProductsList: (page?: number, params?: { name?: string }) => void;
}

const ListTable = ({products, meta, refreshProductsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };
    const locale = useLocale();

    const t = useTranslations('ProductsPage');
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

    const [selectedAllProducts, setSelectedAllProducts] = useState<number[]>([]);

    const isAllChecked = selectedAllProducts.length === products.length && products.length > 0;

    const handleDelete = (id: number) => {
        deleteProduct(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshProductsList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllProducts,'selectedAllProducts')
    }

    const handleEdit = (id: number) => {
        // setIsModalEditOpen(true)
        // getProduct(session?.user?.token, id).then(result => {
        //     setCouponData(result.data)
        // })

        redirect(`/${locale}/products/${id}`)
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllProducts([]); // Unselect all
        } else {
            const ids = products.map(product => product.id); // Get all IDs
            setSelectedAllProducts(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllProducts(IncludeID)   ;
    };
    
    const productSearch = () => {
        refreshProductsList(1, {name: searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_products')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button className="ml-2" onClick={() => productSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex"> 
                    <Link href={"/" + locale + "/products/create"} color="green" 
                        className="
                            hover:bg-transparent display-inline-flex 
                            items-center px-4 py-2 bg-white text-sm font-medium text-black 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 
                            rounded-md border clicked:disabled:outline-none">
                        {t('create_product')}
                    </Link>
                    <button 
                        onClick={() => handleAllDelete()} 
                        className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 border border-red-600"
                    >
                        {t_general('delete')}
                    </button>
                </div>
            </div>

            {/* Table */}
            <Table hoverable>
                <TableHead>
                    <TableHeadCell className="p-4">
                        <Checkbox checked={isAllChecked} onChange={() => handleSelectAllCheckBox()} />
                    </TableHeadCell>
                    <TableHeadCell>{t_general("name")}</TableHeadCell>
                    <TableHeadCell>{t_general("name_ar")}</TableHeadCell>
                    <TableHeadCell>{t("sku")}</TableHeadCell>
                    <TableHeadCell>{t("price")}</TableHeadCell>
                    <TableHeadCell>{t("sale_price")}</TableHeadCell>
                    <TableHeadCell>{t("quantity")}</TableHeadCell>
                    <TableHeadCell>{t("brand")}</TableHeadCell>
                    <TableHeadCell>{t_general("actions")}</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {products.length > 0 ? (
                        products.map((item) => (
                            <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        checked={selectedAllProducts.includes(item.id)} 
                                        onChange={() => handleSelectCheckBox(item.id)} 
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                </TableCell>
                               
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.name_ar}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.sku}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.price}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.sale_price}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {locale == 'ar' ? item?.brand?.name_ar : item?.brand?.name }
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
                                {t('no_products_found')}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshProductsList}
                />
            </div>


        </div>
    );
};

export default ListTable;

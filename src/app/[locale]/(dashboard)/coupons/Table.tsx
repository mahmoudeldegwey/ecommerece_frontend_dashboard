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

import CreateModal from "./CreateModal";
import EditModal from "./EditModal";

import {useTranslations} from 'next-intl';
import {deleteCoupon, getCoupon} from '@/utils/actions/coupons/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

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
    
    const couponSearch = () => {
        refreshCouponsList(1, {name: searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_coupon')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button className="ml-2" onClick={() => couponSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex">
                    <Button onClick={() => setIsModalOpen(true)} color="green" className="text-black hover:bg-transparent">
                        {t('create_coupon')}
                    </Button>
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

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshCouponsList}
                />
            </div>

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

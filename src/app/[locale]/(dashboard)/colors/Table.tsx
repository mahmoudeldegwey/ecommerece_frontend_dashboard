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
import {deleteColor, getColor} from '@/utils/actions/colors/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";

interface Color {
    id: number;
    name: string;
    name_ar: string;
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
    colors: Color[];
    meta: Meta;
    refreshColorsList: (page?: number, params?: { name?: string }) => void;
}

const ListTable = ({colors, meta, refreshColorsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };

    const t = useTranslations('ColorsPage');
    const t_general = useTranslations('General');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [colorData, setColorData] = useState({ id: 0, name: '', name_ar: '' });

    const [selectedAllColors, setSelectedAllColors] = useState<number[]>([]);
    
    // Filter states
    const [filters, setFilters] = useState({ name: '',});

    const isAllChecked = selectedAllColors.length === colors.length && colors.length > 0;

    const handleDelete = (id: number) => {
        deleteColor(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshColorsList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllColors,'selectedAllColors')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        getColor(session?.user?.token, id).then(result => {
            setColorData(result.data)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllColors([]); // Unselect all
        } else {
            const ids = colors.map(color => color.id); // Get all IDs
            setSelectedAllColors(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllColors(IncludeID);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params: any = {};
        if (filters.name) params.name = filters.name;

        refreshColorsList(1, params);
    };

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
                                placeholder={t('search_colors') || "Search by name"}
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                            />
                        </div>
                        
                        <Button color="blue" onClick={applyFilters}>
                            <HiSearch className="w-4 h-4 mr-2" />
                            {t_general('search') || 'Search'}
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        
                        {selectedAllColors.length > 0 && (
                        <button 
                            onClick={() => handleAllDelete()} 
                            className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 border border-red-600"
                        >
                            {t_general('delete')} ({selectedAllColors.length})
                        </button>
                        )}

                        <Link href="#" onClick={() => setIsModalOpen(true)} 
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                            {t('create_color')}
                        </Link>
                        
                    </div>
                </div>

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
                            <TableHeadCell>{t_general("name_ar")}</TableHeadCell>
                            <TableHeadCell>{t_general("actions")}</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {colors.length > 0 ? (
                                colors.map((item) => (
                                    <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell className="p-4">
                                            <Checkbox 
                                                checked={selectedAllColors.includes(item.id)} 
                                                onChange={() => handleSelectCheckBox(item.id)} 
                                            />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.name_ar}
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
                                        {t('no_colors_found')}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {colors.length > 0 && (
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshColorsList}
                />
            </div>
            )}

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshColorsList={refreshColorsList}
            />

           {/* Edit Modal */}
           <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshColorsList={refreshColorsList}
                colorData={colorData}
            />
        </div>
    );
};

export default ListTable;

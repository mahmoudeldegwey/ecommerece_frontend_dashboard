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
import {deleteSize, getSize} from '@/utils/actions/sizes/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

interface Size {
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
    sizes: Size[];
    meta: Meta;
    refreshSizesList: (page?: number, params?: { name?: string }) => void;
}

const ListTable = ({sizes, meta, refreshSizesList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };

    const t = useTranslations('SizesPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [sizeData, setSizeData] = useState({ id: 0, name: '', name_ar: '' });

    const [selectedAllSizes, setSelectedAllSizes] = useState<number[]>([]);

    const isAllChecked = selectedAllSizes.length === sizes.length && sizes.length > 0;

    const handleDelete = (id: number) => {
        deleteSize(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshSizesList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllSizes,'selectedAllSizes')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        getSize(session?.user?.token, id).then(result => {
            setSizeData(result)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllSizes([]); // Unselect all
        } else {
            const ids = sizes.map(size => size.id); // Get all IDs
            setSelectedAllSizes(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllSizes(IncludeID);
    };
    
    const sizeSearch = () => {
        refreshSizesList(1, {name: searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_size')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button className="ml-2" onClick={() => sizeSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex">
                    <Button onClick={() => setIsModalOpen(true)} color="green" className="text-black hover:bg-transparent">
                        {t('create_size')}
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
                    <TableHeadCell>{t_general("name_ar")}</TableHeadCell>
                    <TableHeadCell>{t_general("actions")}</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {sizes.length > 0 ? (
                        sizes.map((item) => (
                            <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        checked={selectedAllSizes.includes(item.id)} 
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
                                {t('no_sizes_found')}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshSizesList}
                />
            </div>

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshSizesList={refreshSizesList}
            />

           {/* Edit Modal */}
           <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshSizesList={refreshSizesList}
                sizeData={sizeData}
            />
        </div>
    );
};

export default ListTable;

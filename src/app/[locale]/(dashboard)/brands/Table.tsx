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
import {deleteBrand, brandSingle} from '@/utils/actions/brands/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

const ListTable = ({brands, meta, refreshBrandsList}) => {
    
    const { data: session } = useSession();

    const t = useTranslations('BrandsPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [brandData, setBrandData] = useState({ id: 0, name: '' });

    const [selectedAllBrands, setSelectedAllBrands] = useState<number[]>([]);

    const isAllChecked = selectedAllBrands.length === brands.length && brands.length > 0;

    const handleDelete = (id: number) => {
        deleteBrand(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshBrandsList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllBrands,'selectedAllBrands')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        brandSingle(session?.user?.token, id).then(result => {
            setBrandData(result)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllBrands([]); // Unselect all
        } else {
            const ids = brands.map(brand => brand.id); // Get all IDs
            setSelectedAllBrands(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllBrands(IncludeID);
    };
    
    const brandSearch = () => {
        refreshBrandsList(1, {name: searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_brands')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button className="ml-2" onClick={() => brandSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex">
                    <Button onClick={() => setIsModalOpen(true)} color="green" className="text-black hover:bg-transparent">
                        {t('create_brand')}
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
                    <TableHeadCell>{t_general("actions")}</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {brands.length > 0 ? (
                        brands.map((item) => (
                            <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        checked={selectedAllBrands.includes(item.id)} 
                                        onChange={() => handleSelectCheckBox(item.id)} 
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.name}
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
                                {t('no_brands_found')}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshBrandsList}
                />
            </div>

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshBrandsList={refreshBrandsList}
            />

           {/* Edit Modal */}
           <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshBrandsList={refreshBrandsList}
                brandData={brandData}
            />
        </div>
    );
};

export default ListTable;

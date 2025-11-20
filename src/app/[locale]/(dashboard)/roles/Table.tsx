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
} from "flowbite-react";

import CreateModal from "./CreateModal";
import EditModal from "./EditModal";

import {useTranslations} from 'next-intl';
import {deleteRole,roleSingle} from '@/utils/actions/roles/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

const ListTable = ({roles, meta ,refreshRolesList}) => {
    
    const { data: session } = useSession();

    const t = useTranslations('RolesPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [roleData, setRoleData] = useState<Role>({ id: 0, name: '', permissions: [] });

    const [selectedAllRoles, setSelectedAllRoles] = useState<number[]>([]);

    const isAllChecked = selectedAllRoles.length === roles.length && roles.length > 0;

    const handleDelete = (id: number) => {
        deleteRole(session?.user?.token,id).then(result =>{
            toast.success(result.message);
            refreshRolesList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllRoles,'selectedAllRoles')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        roleSingle(session?.user?.token,id).then(result => {
            setRoleData(result)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllRoles([]); // Unselect all
        } else {
            const ids = roles.map(role => role.id); // Get all IDs
            setSelectedAllRoles(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllRoles(IncludeID);
    };
    
    const roleSearch = () => {
        refreshRolesList(1, {name:searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* <h1 className="text-2xl font-bold text-left mb-10">{t('roles')}</h1> */}
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_roles')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button  className="ml-2" onClick={() => roleSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex">
                    <Button onClick={() => setIsModalOpen(true)} color="green" className="text-black hover:bg-transparent">
                        {t('create_role')}
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
                        <Checkbox checked={isAllChecked}  onChange={() => handleSelectAllCheckBox()} />
                    </TableHeadCell>
                    <TableHeadCell>{t_general("name")}</TableHeadCell>
                    <TableHeadCell>{t_general("actions")}</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {roles.length > 0 ? (
                        roles.map((item) => (
                            <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        checked={selectedAllRoles.includes(item.id)} 
                                        onChange={() => handleSelectCheckBox(item.id)} 
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="xs" color="blue" onClick={() => handleEdit(item.id)}>Edit</Button>
                                    <Button size="xs" color="red" onClick={() => handleDelete(item.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center p-4">
                                {t('no_roles_found')}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshRolesList}
                />

            </div>

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshRolesList={refreshRolesList}
            />

            {/* Edit Modal */}
            <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshRolesList={refreshRolesList}
                roleData={roleData}
            />

        </div>
    );
};

export default ListTable;

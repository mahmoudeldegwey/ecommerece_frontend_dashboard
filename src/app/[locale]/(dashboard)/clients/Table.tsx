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
import ChangePasswordModal from "./ChangePasswordModal";

import {useTranslations} from 'next-intl';
import {deleteClient,clientSingle} from '@/utils/actions/clients/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

const ListTable = ({clients, meta ,refreshClientsList}) => {
    
    const { data: session } = useSession();

    const t = useTranslations('ClientsPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false);

    const [clientData, setClientData] = useState<Client>({ id: 0, name: '', permissions: [] });

    const [selectedAllClients, setSelectedAllClients] = useState<number[]>([]);

    const isAllChecked = selectedAllClients.length === clients.length && clients.length > 0;

    const handleDelete = (id: number) => {
        deleteClient(session?.user?.token,id).then(result =>{
            toast.success(result.message);
            refreshClientsList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllClients,'selectedAllClients')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        clientSingle(session?.user?.token,id).then(result => {
            setClientData(result)
        })
    }

    const handleChangePassword = (id: number) => {
        setIsModalChangePasswordOpen(true)
        clientSingle(session?.user?.token,id).then(result => {
            setClientData(result)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllClients([]); // Unselect all
        } else {
            const ids = clients.map(client => client.id); // Get all IDs
            setSelectedAllClients(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllClients(IncludeID);
    };
    
    const clientsSearch = () => {
        if(searchType === 'name') refreshClientsList(1, {name:searchTerm,emai:""});
        if(searchType === 'email')  refreshClientsList(1, {name:"",email:searchTerm})
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <Select required
                        className="w-28 pr-3"   
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option key="username" value="username">{t('username')}</option>
                        <option key="email" value="email">{t_general('email')}</option>                          
                    </Select>
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_clients')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button  className="ml-2" onClick={() => clientsSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex">
                    <Button onClick={() => setIsModalOpen(true)} color="green" className="text-black hover:bg-transparent">
                        {t('create_client')}
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
                    <TableHeadCell>{t("username")}</TableHeadCell>
                    <TableHeadCell>{t_general("email")}</TableHeadCell>
                    <TableHeadCell>{t_general("actions")}</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {clients.length > 0 ? (
                        clients.map((item) => (
                            <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        checked={selectedAllClients.includes(item.id)} 
                                        onChange={() => handleSelectCheckBox(item.id)} 
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.username}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.email}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="xs" color="blue" onClick={() => handleEdit(item.id)}>{t_general('edit')}</Button>
                                    <Button size="xs" color="blue" onClick={() => handleChangePassword(item.id)}>{t('change_password')}</Button>
                                    <Button size="xs" color="red" onClick={() => handleDelete(item.id)}>{t_general('delete')}</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center p-4">
                                {t('no_clients_found')}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshClientsList}
                />

            </div>

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshClientsList={refreshClientsList}
            />

           {/* Edit Modal */}
           <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshClientsList={refreshClientsList}
                clientData={clientData}
            />

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isModalChangePasswordOpen} 
                onClose={() => setIsModalChangePasswordOpen(false)} 
                refreshClientsList={refreshClientsList}
                clientData={clientData}
            />

        </div>
    );
};

export default ListTable;

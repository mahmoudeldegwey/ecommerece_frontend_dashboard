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
import {deleteUser,userSingle} from '@/utils/actions/users/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

const ListTable = ({users, meta ,refreshUsersList}) => {
    
    const { data: session } = useSession();

    const t = useTranslations('UsersPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false);

    const [userData, setUserData] = useState<User>({ id: 0, name: '', permissions: [] });

    const [selectedAllUsers, setselectedAllUsers] = useState<number[]>([]);

    const isAllChecked = selectedAllUsers.length === users.length && users.length > 0;

    const handleDelete = (id: number) => {
        deleteUser(session?.user?.token,id).then(result =>{
            toast.success(result.message);
            refreshUsersList()
        })
    };

    const hadnleChnagePassword = (id: number) => {
        setIsModalChangePasswordOpen(true);
        userSingle(session?.user?.token,id).then(result => {
            setUserData(result);
        }
        )
    }

    const handleAllDelete = () => {
        console.log(selectedAllUsers,'selectedAllUsers')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        userSingle(session?.user?.token,id).then(result => {
            setUserData(result)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllUsers([]); // Unselect all
        } else {
            const ids = users.map(role => role.id); // Get all IDs
            setSelectedAllUsers(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllUsers(IncludeID);
    };
    
    const userSearch = () => {
        if(searchType === 'name') refreshUsersList(1, {name:searchTerm,emai:""});
        if(searchType === 'email')  refreshUsersList(1, {name:"",email:searchTerm})
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
                        <option key="name" value="name">{t_general('name')}</option>
                        <option key="email" value="email">{t_general('email')}</option>                          
                    </Select>
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_users')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button  className="ml-2" onClick={() => userSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex">
                    <Button onClick={() => setIsModalOpen(true)} color="green" className="text-black hover:bg-transparent">
                        {t('create_user')}
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
                    <TableHeadCell>{t_general("email")}</TableHeadCell>
                    <TableHeadCell>{t_general("actions")}</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {users.length > 0 ? (
                        users.map((item) => (
                            <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        checked={selectedAllUsers.includes(item.id)} 
                                        onChange={() => handleSelectCheckBox(item.id)} 
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.email}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="xs" color="blue" onClick={() => handleEdit(item.id)}>{t_general('edit')}</Button>
                                    <Button size="xs" color="blue" onClick={() => hadnleChnagePassword(item.id)}>{t('change_password')}</Button>
                                    <Button size="xs" color="red" onClick={() => handleDelete(item.id)}>{t_general('delete')}</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center p-4">
                                {t('no_users_found')}.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshUsersList}
                />

            </div>

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshUsersList={refreshUsersList}
            />

           {/* Edit Modal */}
           <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshUsersList={refreshUsersList}
                userData={userData}
            />

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isModalChangePasswordOpen} 
                onClose={() => setIsModalChangePasswordOpen(false)} 
                refreshUsersList={refreshUsersList}
                userData={userData}
            />

        </div>
    );
};

export default ListTable;

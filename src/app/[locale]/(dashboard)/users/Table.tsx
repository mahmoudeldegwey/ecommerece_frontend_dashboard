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

import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import ChangePasswordModal from "./ChangePasswordModal";

import {useTranslations} from 'next-intl';
import {deleteUser,userSingle} from '@/utils/actions/users/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import { HiSearch, HiFilter, HiX, HiAdjustments } from "react-icons/hi";
import Link from "next/link";

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

    // Filter states
    const [filters, setFilters] = useState({
        username: '',
        email: ''
    });

    const [showFilters, setShowFilters] = useState(false);

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
    
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params: any = {};
        
        if (filters.username) params.name = filters.username;
        if (filters.email) params.status = filters.email;
        
        refreshUsersList(1, params);
    };

    const clearFilters = () => {
        setFilters({
            username: '',
            email: ''
        });
        refreshUsersList(1, {});
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.username) count++;
        if (filters.email) count++;
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
                                placeholder={t('search_users') }
                                value={filters.username}
                                onChange={(e) => handleFilterChange('username', e.target.value)}
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        
                        {selectedAllUsers.length > 0 && (
                        <button 
                            onClick={() => handleAllDelete()} 
                            className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 border border-red-600"
                        >
                            {t_general('delete')} ({selectedAllUsers.length})
                        </button>
                        )}

                        <Link href="#" onClick={() => setIsModalOpen(true)} 
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                            {t('create_user') }
                        </Link>
                        
                    </div>

                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Status */}
                            <div>
                                <Label htmlFor="email" value={t_general("email") || "email"} className="mb-2" />
                                <TextInput 
                                    className="pl-10"
                                    placeholder={t_general('email') }
                                    value={filters.email}
                                    onChange={(e) => handleFilterChange('email', e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                />
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
                        
                        {filters.email && (
                            <Badge color="info">
                                {t("email")}: {filters.email}
                                <button onClick={() => handleFilterChange('email', '')} className="ml-1">
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
                </div>
            </div>

            {/* Pagination */}
            {users.length > 0 &&(
                <div className="flex justify-center mt-4">
                    <Pagination 
                        meta={meta}
                        handlePageChange={refreshUsersList}
                    />

                </div>
            )}

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

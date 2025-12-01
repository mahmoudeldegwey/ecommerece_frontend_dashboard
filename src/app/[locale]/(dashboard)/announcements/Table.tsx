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

import {useTranslations} from 'next-intl';
import {deleteAnnouncement, getAnnouncement} from '@/utils/actions/announcements/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import { HiSearch, HiFilter, HiX, HiAdjustments } from "react-icons/hi";
import Link from "next/link";

interface Announcement {
  id: number;
  name: string;
  message: string;
  start_at: string;
  end_at: string;
  is_active: boolean;
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
    announcements: Announcement[];
    meta: Meta;
    refreshAnnouncementsList: (page?: number, params?: any) => void;
}

const ListTable = ({announcements, meta, refreshAnnouncementsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };

    const t = useTranslations('AnnouncementsPage');
    const t_general = useTranslations('General');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [announcementData, setAnnouncementData] = useState({
        id: 0,
        name: '',
        message: '',
        start_at: '',
        end_at: '',
        is_active: false,
    });

    const [selectedAllAnnouncements, setSelectedAllAnnouncements] = useState<number[]>([]);
    
    // Filter states
    const [filters, setFilters] = useState({
        name: '',
        status: ''
    });

    const [showFilters, setShowFilters] = useState(false);

    const isAllChecked = selectedAllAnnouncements.length === announcements.length && announcements.length > 0;

    const handleDelete = (id: number) => {
        deleteAnnouncement(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshAnnouncementsList()
        })
    };

    const handleAllDelete = () => {
        console.log(selectedAllAnnouncements,'selectedAllAnnouncements')
    }

    const handleEdit = (id: number) => {
        setIsModalEditOpen(true)
        getAnnouncement(session?.user?.token, id).then(result => {
            setAnnouncementData(result.data)
        })
    }

     // Handle Select All Checkbox
     const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllAnnouncements([]); // Unselect all
        } else {
            const ids = announcements.map(announcement => announcement.id); // Get all IDs
            setSelectedAllAnnouncements(ids); // Select all
        }
    };

    // Handle Individual Checkbox
    const handleSelectCheckBox = (id: number) => {
        const IncludeID = (prev: number[]): number[] =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];

        setSelectedAllAnnouncements(IncludeID);
    };
    
   const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params: any = {};
        
        if (filters.name) params.name = filters.name;
        if (filters.status) params.status = filters.status;
        
        refreshAnnouncementsList(1, params);
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            status: ''
        });
        refreshAnnouncementsList(1, {});
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.status) count++;
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
                                placeholder={t('search_announcement') || "Search announcements by name"}
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
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
                        
                        {selectedAllAnnouncements.length > 0 && (
                        <button 
                            onClick={() => handleAllDelete()} 
                            className="bg-red-600 text-white px-4 py-2 rounded-md ml-2 border border-red-600"
                        >
                            {t_general('delete')} ({selectedAllAnnouncements.length})
                        </button>
                        )}

                        <Link href="#" onClick={() => setIsModalOpen(true)} 
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                            {t('create_announcement')}
                        </Link>
                        
                    </div>

                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Status */}
                            <div>
                                <Label htmlFor="status" value={t("status") || "status"} className="mb-2" />
                                <Select
                                    id="status"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
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
                        
                        {filters.status && (
                            <Badge color="info">
                                Status: {filters.status}
                                <button onClick={() => handleFilterChange('status', '')} className="ml-1">
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
                                <Checkbox checked={isAllChecked} onChange={() => handleSelectAllCheckBox()} />
                            </TableHeadCell>
                            <TableHeadCell>{t_general("name")}</TableHeadCell>
                            <TableHeadCell>{t("start_at")}</TableHeadCell>
                            <TableHeadCell>{t("end_at")}</TableHeadCell>
                            <TableHeadCell>{t("status")}</TableHeadCell>
                            <TableHeadCell>{t_general("actions")}</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {announcements.length > 0 ? (
                                announcements.map((item) => (
                                    <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell className="p-4">
                                            <Checkbox 
                                                checked={selectedAllAnnouncements.includes(item.id)} 
                                                onChange={() => handleSelectCheckBox(item.id)} 
                                            />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </TableCell>
                                    
                                    
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {new Date(item.start_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {new Date(item.end_at).toLocaleString()}
                                        </TableCell>
                                    
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.is_active ? t_general('active') : t_general('inactive')}
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
                                        {t('no_data_found')}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}            
            {announcements.length > 0 && (
                <div className="flex justify-center mt-4">
                    <Pagination 
                        meta={meta}
                        handlePageChange={refreshAnnouncementsList}
                    />
                </div>
            )}

            {/* Create Modal */}
            <CreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshAnnouncementsList={refreshAnnouncementsList}
            />

           {/* Edit Modal */}
           <EditModal 
                isOpen={isModalEditOpen} 
                onClose={() => setIsModalEditOpen(false)} 
                refreshAnnouncementsList={refreshAnnouncementsList}
                announcementData={announcementData}
            />
        </div>
    );
};

export default ListTable;

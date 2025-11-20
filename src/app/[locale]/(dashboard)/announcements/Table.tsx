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
import {deleteAnnouncement, getAnnouncement} from '@/utils/actions/announcements/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";

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
    refreshAnnouncementsList: (page?: number, params?: { name?: string }) => void;
}

const ListTable = ({announcements, meta, refreshAnnouncementsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };

    const t = useTranslations('AnnouncementsPage');
    const t_general = useTranslations('General');

    const [searchTerm, setSearchTerm] = useState("");

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
    
    const AnnouncementSearch = () => {
        refreshAnnouncementsList(1, {name: searchTerm});
    }

    return (
        <div className="overflow-x-auto p-4">
            <Breadcrumb />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex">
                    <TextInput 
                        className="w-60"
                        placeholder={t('search_announcement')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Button className="ml-2" onClick={() => AnnouncementSearch()}>
                        {t_general('search')}
                    </Button>
                </div>
                <div className="flex">
                    <Button onClick={() => setIsModalOpen(true)} color="green" className="text-black hover:bg-transparent">
                        {t('create_announcement')}
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
                    <TableHeadCell>{t("start_at")}</TableHeadCell>
                    <TableHeadCell>{t("end_at")}</TableHeadCell>
                    <TableHeadCell>{t("is_active")}</TableHeadCell>
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

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Pagination 
                    meta={meta}
                    handlePageChange={refreshAnnouncementsList}
                />
            </div>

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

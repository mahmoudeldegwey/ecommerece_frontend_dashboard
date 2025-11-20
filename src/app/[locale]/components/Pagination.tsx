import {useTranslations} from 'next-intl';
import { MdPayment } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

interface Meta {
    current_page: number,
    per_page: number,
    last_page: number,
    total: number
}

interface PaginationProps {
    meta: Meta;
    handlePageChange: (page: number) => void;
}

const Pagination = ({ meta, handlePageChange }: PaginationProps) => {

    const t_general = useTranslations('General');

    const {current_page,last_page} = meta 

    if (last_page <= 1) return null;

    const handleRequest = (page: number) => {
       handlePageChange(page)
    }

    return ( 
        <div>
            <nav aria-label="Page navigation example">
                <ul className="flex items-center -space-x-px h-10 text-base">
                    <li>
                        <button
                            onClick={() => handlePageChange(current_page - 1)}
                            disabled={current_page === 1}
                            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight 
                            ${current_page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} 
                            bg-white border border-gray-300 rounded-s-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                        >
                            <span className="sr-only">{t_general('previous')}</span>
                            <FaArrowLeft />
                        </button>
                    </li>
                    {Array.from({ length: last_page }, (_, index) => index + 1).map((page) => (
                        <li key={page}>
                            <button 
                                className={`flex items-center justify-center px-4 h-10 leading-tight 
                                ${page === current_page ? 'text-white bg-blue-500' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} 
                                border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                onClick={() => handleRequest(page)}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handlePageChange(current_page + 1)}
                            disabled={current_page === last_page}
                            className={`flex items-center justify-center px-4 h-10 leading-tight 
                            ${current_page === last_page ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} 
                            bg-white border border-gray-300 rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                        >
                            <span className="sr-only">{t_general('next')}</span>
                            <FaArrowRight />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )

}

export default Pagination;
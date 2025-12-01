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

import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {deleteProduct} from '@/utils/actions/products/actions'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import Pagination from '@/app/[locale]/components/Pagination'
import Breadcrumb from "@/app/[locale]/components/Breadcrumb";
import { redirect } from "next/navigation";
import { 
    HiSearch, 
    HiFilter, 
    HiX, 
    HiChevronDown,
    HiAdjustments 
} from "react-icons/hi";

interface Product {
    id: number;
    name: string;
    name_ar: string;
    sku: string;
    price: number;
    sale_price: number;
    quantity: number;
    brand?: {
        name: string;
        name_ar: string;
    };
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
    products: Product[];
    meta: Meta;
    refreshProductsList: (page?: number, params?: any) => void;
}

const ListTable = ({products, meta, refreshProductsList}: ListTableProps) => {
    
    const { data: session } = useSession() as { data: CustomSession };
    const locale = useLocale();

    const t = useTranslations('ProductsPage');
    const t_general = useTranslations('General');

    const [showFilters, setShowFilters] = useState(false);
    const [selectedAllProducts, setSelectedAllProducts] = useState<number[]>([]);

    // Filter states
    const [filters, setFilters] = useState({
        name: '',
        sku: '',
        minPrice: '',
        maxPrice: '',
        minQuantity: '',
        maxQuantity: '',
        brand: '',
        inStock: 'all' // all, in_stock, out_of_stock
    });

    const isAllChecked = selectedAllProducts.length === products.length && products.length > 0;

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        deleteProduct(session?.user?.token, id).then(result =>{
            toast.success(result.message);
            refreshProductsList();
        });
    };

    const handleAllDelete = () => {
        if (selectedAllProducts.length === 0) {
            toast.warning('Please select products to delete');
            return;
        }
        
        if (!confirm(`Are you sure you want to delete ${selectedAllProducts.length} product(s)?`)) return;
        
        console.log(selectedAllProducts, 'selectedAllProducts');
        // Implement bulk delete logic here
    };

    const handleEdit = (id: number) => {
        redirect(`/${locale}/products/${id}`);
    };

    const handleSelectAllCheckBox = () => {
        if (isAllChecked) {
            setSelectedAllProducts([]);
        } else {
            const ids = products.map(product => product.id);
            setSelectedAllProducts(ids);
        }
    };

    const handleSelectCheckBox = (id: number) => {
        setSelectedAllProducts(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };
    
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params: any = {};
        
        if (filters.name) params.name = filters.name;
        if (filters.sku) params.sku = filters.sku;
        if (filters.minPrice) params.min_price = filters.minPrice;
        if (filters.maxPrice) params.max_price = filters.maxPrice;
        if (filters.minQuantity) params.min_quantity = filters.minQuantity;
        if (filters.maxQuantity) params.max_quantity = filters.maxQuantity;
        if (filters.brand) params.brand = filters.brand;
        if (filters.inStock !== 'all') params.in_stock = filters.inStock;
        
        refreshProductsList(1, params);
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            sku: '',
            minPrice: '',
            maxPrice: '',
            minQuantity: '',
            maxQuantity: '',
            brand: '',
            inStock: 'all'
        });
        refreshProductsList(1, {});
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.name) count++;
        if (filters.sku) count++;
        if (filters.minPrice) count++;
        if (filters.maxPrice) count++;
        if (filters.minQuantity) count++;
        if (filters.maxQuantity) count++;
        if (filters.brand) count++;
        if (filters.inStock !== 'all') count++;
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
                                placeholder={t('search_products') || "Search by name, SKU..."}
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
                        {selectedAllProducts.length > 0 && (
                            <Button 
                                color="failure" 
                                onClick={handleAllDelete}
                                size="sm"
                            >
                                {t_general('delete')} ({selectedAllProducts.length})
                            </Button>
                        )}
                        <Link 
                            href={`/${locale}/products/create`}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {t('create_product') || 'Create Product'}
                        </Link>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* SKU Filter */}
                            <div>
                                <Label htmlFor="sku" value={t("sku") || "SKU"} className="mb-2" />
                                <TextInput
                                    id="sku"
                                    placeholder="Enter SKU"
                                    value={filters.sku}
                                    onChange={(e) => handleFilterChange('sku', e.target.value)}
                                />
                            </div>

                            {/* Price Range */}
                            {/* <div>
                                <Label value={t("price_range") || "Price Range"} className="mb-2" />
                                <div className="flex gap-2">
                                    <TextInput
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    />
                                    <TextInput
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    />
                                </div>
                            </div> */}

                            {/* Quantity Range */}
                            {/* <div>
                                <Label value={t("quantity_range") || "Quantity Range"} className="mb-2" />
                                <div className="flex gap-2">
                                    <TextInput
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minQuantity}
                                        onChange={(e) => handleFilterChange('minQuantity', e.target.value)}
                                    />
                                    <TextInput
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxQuantity}
                                        onChange={(e) => handleFilterChange('maxQuantity', e.target.value)}
                                    />
                                </div>
                            </div> */}

                            {/* Stock Status */}
                            <div>
                                <Label htmlFor="stock_status" value={t("stock_status") || "Stock Status"} className="mb-2" />
                                <Select
                                    id="stock_status"
                                    value={filters.inStock}
                                    onChange={(e) => handleFilterChange('inStock', e.target.value)}
                                >
                                    <option value="all">All Products</option>
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
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
                        {filters.name && (
                            <Badge color="info">
                                Name: {filters.name}
                                <button onClick={() => handleFilterChange('name', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.sku && (
                            <Badge color="info">
                                SKU: {filters.sku}
                                <button onClick={() => handleFilterChange('sku', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.minPrice && (
                            <Badge color="info">
                                Min Price: ${filters.minPrice}
                                <button onClick={() => handleFilterChange('minPrice', '')} className="ml-1">
                                    <HiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.maxPrice && (
                            <Badge color="info">
                                Max Price: ${filters.maxPrice}
                                <button onClick={() => handleFilterChange('maxPrice', '')} className="ml-1">
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
                                <Checkbox checked={isAllChecked} onChange={handleSelectAllCheckBox} />
                            </TableHeadCell>
                            <TableHeadCell>{t_general("name") || "Name"}</TableHeadCell>
                            <TableHeadCell>{t_general("name_ar") || "Name (AR)"}</TableHeadCell>
                            <TableHeadCell>{t("sku") || "SKU"}</TableHeadCell>
                            <TableHeadCell>{t("price") || "Price"}</TableHeadCell>
                            <TableHeadCell>{t("sale_price") || "Sale Price"}</TableHeadCell>
                            <TableHeadCell>{t("quantity") || "Quantity"}</TableHeadCell>
                            <TableHeadCell>{t("brand") || "Brand"}</TableHeadCell>
                            <TableHeadCell>{t_general("actions") || "Actions"}</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell className="p-4">
                                            <Checkbox 
                                                checked={selectedAllProducts.includes(item.id)} 
                                                onChange={() => handleSelectCheckBox(item.id)} 
                                            />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.name_ar}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.sku}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            ${item.price}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            ${item.sale_price}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <Badge color={item.quantity > 0 ? "success" : "failure"}>
                                                {item.quantity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {locale === 'ar' ? item?.brand?.name_ar : item?.brand?.name}
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button size="xs" color="blue" onClick={() => handleEdit(item.id)}>
                                                {t_general('edit') || 'Edit'}
                                            </Button>
                                            <Button size="xs" color="red" onClick={() => handleDelete(item.id)}>
                                                {t_general('delete') || 'Delete'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center p-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <HiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {t('no_products_found') || 'No products found'}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {products.length > 0 && (
                <div className="flex justify-center">
                    <Pagination 
                        meta={meta}
                        handlePageChange={(page) => refreshProductsList(page, filters)}
                    />
                </div>
            )}
        </div>
    );
};

export default ListTable;
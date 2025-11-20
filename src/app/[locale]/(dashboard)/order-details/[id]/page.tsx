"use client"

import { Card, Badge, Button, Table, Pagination } from 'flowbite-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {getOrder, updateOrderStatus} from '@/utils/actions/orders/actions'
import { useState,useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { use } from 'react';
import parsePrice from "@/utils/helpers";

export default function OrderDetails ({params}:{
    params: Promise<{id: string, locale: string}>
}) {
  const { id, locale } = use(params);

  const t = useTranslations('orderDetailsPage');
  const session = useSession();
  const [order, setOrder] = useState<any>({});
  const [products, setProducts] = useState<Array<any>>([]);

  // State for order status and pagination
  const [currentStatus, setCurrentStatus] = useState(order.status || '');

  // Order status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#F59E0B' },
    { value: 'confirmed', label: 'Confirmed', color: '#3B82F6' },
    { value: 'shipped', label: 'Shipped', color: '#6366F1' },
    { value: 'delivered', label: 'Delivered', color: '#10B981' },
    { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
    { value: 'refunded', label: 'refunded', color: '#4d7499' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      shipped: 'indigo',
      delivered: 'success',
      cancelled: 'failure',
      refunded: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      paypal: 'PayPal',
      cod: 'Cash on Delivery',
      bank_transfer: 'Bank Transfer'
    };
    return labels[method] || method;
  };

  const handleStatusChange = (selectedOption) => {
    const newStatus = selectedOption.value;

    if (session?.data?.user?.token) {
      updateOrderStatus(session?.data?.user?.token, id, newStatus).then(result => {
        if(result && result.check === true) {
          toast.success(`Order status updated to ${selectedOption.label}!`);
          setCurrentStatus(newStatus);
        }else{
          toast.error(`Failed to update order status. - ${result.errors || 'Unknown error'}`);
        }
      })
    }

    
    // Here you would typically make an API call to update the status
  };

  const handlePrintOrder = () => {
    //toast.info('Printing order...');
    // Print functionality would go here
  };

  const handleDownloadInvoice = () => {
    //toast.success('Invoice downloaded successfully!');
    // Download functionality would go here
  };

  const handleTrackOrder = () => {
    //toast.info('Redirecting to tracking page...');
    // Track order functionality would go here
  };

  useEffect(() => {
    if (session?.data?.user?.token) {
      getOrder(session?.data?.user?.token, id).then(result => {
        setOrder(result)
        setProducts(result?.products || [])
        setCurrentStatus(order.status?.toUpperCase() )
      })
    }
  },[id,session]) 

  // console.log(currentStatus,'currentStatus');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('order_details')}
          </h1>
          <p className="text-gray-600">
            {t('order')} #{order.order_number} • {t('placed_on')} {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button color="gray" onClick={handlePrintOrder}>
            {t('print_order')}
          </Button>
          <Button color="blue" onClick={handleDownloadInvoice}>
            {t('download_invoice')}
          </Button>
          <Button color="green" onClick={handleTrackOrder}>
            {t('track_order')}
          </Button>
        </div>
      </div>

      {/* Order Status and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('order_info')}</h2>
            <div className="flex items-center space-x-3">
              <Badge color={getStatusColor(order?.status)} size="lg">
                {currentStatus?.toUpperCase() || order?.status?.toUpperCase() || 'N/A'}
              </Badge>
              <div className="w-48">
                <Select
                  value={statusOptions.find(option => option.value === currentStatus)}
                  onChange={handleStatusChange}
                  options={statusOptions}
                  placeholder="Update Status..."
                  className="text-sm"
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      color: state.data.color,
                      fontWeight: state.isSelected ? 'bold' : 'normal',
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: state.data.color,
                      fontWeight: 'bold',
                    })
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t('customer_name')}</p>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('customer_phone')}</p>
              <p className="font-medium">{order.customer_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('customer_email')}</p>
              <p className="font-medium">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('payment_method')}</p>
              <p className="font-medium">{getPaymentMethodLabel(order.payment_method)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('items_count')}</p>
              <p className="font-medium">{order.products_count} items ({order.products_quantity} total qty)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('last_updated')}</p>
              <p className="font-medium">{new Date(order.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order?.total_price}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${order?.shipping_cost}</span>
            </div>
            { order.discount_amount ?
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${order?.discount_amount}</span>
              </div>
              : null
            }
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>{t('total')}:</span>
              <span>${order?.final_cost}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Shipping & Billing Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
          <p className="text-gray-700">{order?.customer_name}</p>
          <p className="text-gray-600">{order?.shipping_address}</p>
          <p className="text-gray-600">{order?.city?.name}, {order?.country?.name}</p>
        </Card>
        {/* Billing Address */}
        { 
        order.use_different_billing_address 
        ?
        <Card>
          <h3 className="text-lg font-semibold mb-3">Billing Address</h3>
          <p className="text-gray-700">{order?.billing_address?.name}</p>
          <p className="text-gray-600">{order?.billing_address?.address}</p>
          <p className="text-gray-600">{order?.billing_address?.phone}</p>
        </Card>
        : null
        }

      </div>

      {/* Products Table with Pagination */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order Items</h2>
          <div className="text-sm text-gray-500">
            
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Product</Table.HeadCell>
              <Table.HeadCell>SKU</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Total</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {products?.map((product) => (
                <Table.Row key={product.product_id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center space-x-3">
                    <img src={product?.product?.main_image} alt={product?.product?.name} className="w-10 h-10 object-cover rounded" />
                    <span>{product?.product?.name}</span>
                  </Table.Cell>
                  <Table.Cell>{product?.product?.sku}</Table.Cell>
                  <Table.Cell>{product?.product?.sale_price != null ? product?.product?.sale_price : product?.product?.price}</Table.Cell>
                  <Table.Cell>{product?.product_quantity}</Table.Cell>
                  <Table.Cell>
                    {Number((product?.product?.sale_price != null ? Number(parsePrice(product?.product?.sale_price)) : Number(parsePrice(product?.product?.price))) * Number(product?.product_quantity)).toFixed(2) }
                  </Table.Cell>
                </Table.Row>
 ))}
            </Table.Body>
          </Table>
        </div>

      </Card>
    </div>
  );
};
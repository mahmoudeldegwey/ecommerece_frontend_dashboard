"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {ordersList} from '@/utils/actions/orders/actions'

interface Product {
  id: number;
  name: string;
  name_ar: string;
  code: string;
  start_at: string;
  end_at: string;
  type: 'fixed' | 'percentage';
  amount: number;
  usage: number;
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

interface ParamsSearch {
  name?: string;
}

interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string;
  };
}

const OrdersPage = () => {
  const { data: session } = useSession() as { data: CustomSession };
  
  const [orders, setOrders] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({ 
    current_page: 1,
    from: 0,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  });

  const getOrdersList = (page: number = 1, params: ParamsSearch = {}) => {
    if (session?.user?.token) {
      ordersList(session.user.token, page, params).then(result => {
        setOrders(result.data);
        setMeta(result.meta)
      });
    }
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getOrdersList()
    }
  }, [session]);

  return (
    <div>
      <ListTable orders={orders} meta={meta} refreshOrdersList={getOrdersList} />
    </div>
  )
}

export default OrdersPage
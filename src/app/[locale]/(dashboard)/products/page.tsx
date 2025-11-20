"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {productsList} from '@/utils/actions/products/actions'

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

const ProductsPage = () => {
  const { data: session } = useSession() as { data: CustomSession };
  
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({ 
    current_page: 1,
    from: 0,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  });

  const getProductsList = (page: number = 1, params: ParamsSearch = {}) => {
    if (session?.user?.token) {
      productsList(session.user.token, page, params).then(result => {
        setProducts(result.data);
        setMeta(result.meta)
      });
    }
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getProductsList()
    }
  }, [session]);

  return (
    <div>
      <ListTable products={products} meta={meta} refreshProductsList={getProductsList} />
    </div>
  )
}

export default ProductsPage
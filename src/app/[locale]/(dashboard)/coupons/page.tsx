"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {couponsList} from '@/utils/actions/coupons/actions'

interface Coupon {
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

const CouponsPage = () => {
  const { data: session } = useSession() as { data: CustomSession };
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [meta, setMeta] = useState<Meta>({ 
    current_page: 1,
    from: 0,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  });

  const getCouponsList = (page: number = 1, params: ParamsSearch = {}) => {
    if (session?.user?.token) {
      couponsList(session.user.token, page, params).then(result => {
        setCoupons(result.data);
        setMeta(result.meta)
      });
    }
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getCouponsList()
    }
  }, [session]);

  return (
    <div>
      <ListTable coupons={coupons} meta={meta} refreshCouponsList={getCouponsList} />
    </div>
  )
}

export default CouponsPage
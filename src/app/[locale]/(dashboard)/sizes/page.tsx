"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {sizesList} from '@/utils/actions/sizes/actions'

interface Size {
  id: number;
  name: string;
  name_ar: string;
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

const SizesPage = () => {
  const { data: session } = useSession() as { data: CustomSession };
  
  const [sizes, setSizes] = useState<Size[]>([]);
  const [meta, setMeta] = useState<Meta>({ 
    current_page: 1,
    from: 0,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  });

  const getSizesList = (page: number = 1, params: ParamsSearch = {}) => {
    if (session?.user?.token) {
      sizesList(session.user.token, page, params).then(result => {
        setSizes(result.data);
        setMeta(result.meta)
      });
    }
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getSizesList()
    }
  }, [session]);

  return (
    <div>
      <ListTable sizes={sizes} meta={meta} refreshSizesList={getSizesList} />
    </div>
  )
}

export default SizesPage
"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {colorsList} from '@/utils/actions/colors/actions'

interface Color {
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

const ColorsPage = () => {
  const { data: session } = useSession() as { data: CustomSession };
  
  const [colors, setColors] = useState<Color[]>([]);
  const [meta, setMeta] = useState<Meta>({ 
    current_page: 1,
    from: 0,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  });

  const getColorsList = (page: number = 1, params: ParamsSearch = {}) => {
    if (session?.user?.token) {
      colorsList(session.user.token, page, params).then(result => {
        setColors(result.data);
        setMeta(result.meta)
      });
    }
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getColorsList()
    }
  }, [session]);

  return (
    <div>
      <ListTable colors={colors} meta={meta} refreshColorsList={getColorsList} />
    </div>
  )
}

export default ColorsPage
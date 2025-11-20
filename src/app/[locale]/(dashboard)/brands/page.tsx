"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {brandsList} from '@/utils/actions/brands/actions'

interface paramsSearch {
  name?:string
}

const BrandsPage =  () => {
  const { data: session } = useSession();
  
  const [brands, setBrands] = useState([]);
  const [meta, setMeta] = useState({});

  const getBrandsList = (page:number = 1, params:paramsSearch = {}) => {
    brandsList(session?.user?.token, page, params).then(result => {
      setBrands(result.data);
      setMeta(result.meta)
    });
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getBrandsList()
    }
  }, [session]);

  return (
    <div>
      <ListTable brands={brands} meta={meta} refreshBrandsList={getBrandsList} />
    </div>
  )
}

export default BrandsPage
"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {categoriesList} from '@/utils/actions/categories/actions'

interface paramsSearch {
  name?:string
}

const CategoriesPage =  () => {
  const { data: session } = useSession();
  
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({});

  const getCategoriesList = (page:number = 1, params:paramsSearch = {}) => {
    categoriesList(session?.user?.token, page, params).then(result => {
      setCategories(result.data);
      setMeta(result.meta)
    });
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getCategoriesList()
    }
  }, [session]);

  return (
    <div>
      <ListTable categories={categories} meta={meta} refreshCategoriesList={getCategoriesList} />
    </div>
  )
}

export default CategoriesPage
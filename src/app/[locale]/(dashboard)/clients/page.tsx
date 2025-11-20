"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState,useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {clientsList} from '@/utils/actions/clients/actions'

interface paramsSearch {
  name?:string
}

const ClientsPage =  () => {
  const { data: session } = useSession();
  
  const [clients, setClients] = useState([]);
  const [meta, setMeta] = useState({});

 const getClientsList = (page:number = 1, params:paramsSearch = {}) => {
  clientsList(session?.user?.token, page, params).then(result => {
    setClients(result.data);
    setMeta(result.meta)
  });
 }

  useEffect(() => {   
      if (session?.user?.token) {
        getClientsList()
      }
  }, [session]);

  return (
    <div>
        <ListTable clients={clients} meta={meta} refreshClientsList={getClientsList} />
    </div>
  )
}

export default ClientsPage
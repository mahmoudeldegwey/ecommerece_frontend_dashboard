"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState,useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {rolesList} from '@/utils/actions/roles/actions'

interface paramsSearch {
  name?:string
}

const RolesPage =  () => {
  const { data: session } = useSession();

  const t = useTranslations('RolesPage');
  
  const [roles, setRoles] = useState([]);
  const [meta, setMeta] = useState({});

 const getRolesList = (page:number = 1, params:paramsSearch = {}) => {
    rolesList(session?.user?.token, page, params).then(result => {
      setRoles(result.data);
      setMeta(result.meta)
    });
 }

  useEffect(() => {   
      if (session?.user?.token) {
        getRolesList()
      }
  }, [session]);

  return (
    <div>
        <ListTable roles={roles} meta={meta} refreshRolesList={getRolesList} />
    </div>
  )
}

export default RolesPage
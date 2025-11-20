"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState,useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {usersList} from '@/utils/actions/users/actions'

interface paramsSearch {
  name?:string
}

const UsersPage =  () => {
  const { data: session } = useSession();
  
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});

 const getUsersList = (page:number = 1, params:paramsSearch = {}) => {
  usersList(session?.user?.token, page, params).then(result => {
    setUsers(result.data);
    setMeta(result.meta)
  });
 }

  useEffect(() => {   
      if (session?.user?.token) {
        getUsersList()
      }
  }, [session]);

  return (
    <div>
        <ListTable users={users} meta={meta} refreshUsersList={getUsersList} />
    </div>
  )
}

export default UsersPage
"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import ListTable from './Table'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {announcementsList} from '@/utils/actions/announcements/actions'

interface Announcement {
  id: number;
  name: string;
  message: string;
  start_at: string;
  end_at: string;
  is_active: boolean;
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

const AnnouncementsPage = () => {
  const { data: session } = useSession() as { data: CustomSession };
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [meta, setMeta] = useState<Meta>({ 
    current_page: 1,
    from: 0,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  });

  const getAnnouncementsList = (page: number = 1, params: ParamsSearch = {}) => {
    if (session?.user?.token) {
      announcementsList(session.user.token, page, params).then(result => {
        setAnnouncements(result.data);
        setMeta(result.meta)
      });
    }
  }

  useEffect(() => {   
    if (session?.user?.token) {
      getAnnouncementsList()
    }
  }, [session]);

  return (
    <div>
      <ListTable announcements={announcements} meta={meta} refreshAnnouncementsList={getAnnouncementsList} />
    </div>
  )
}

export default AnnouncementsPage
"use client";
import Image from "next/image";
import { useSession} from "next-auth/react";
import {useTranslations} from 'next-intl';
import { useLocale } from "next-intl";

export default function Home() {
  const { data: session, status } = useSession();
  const t = useTranslations('HomePage');
  const currentLocale = useLocale();

  return (
    <div >
      
      <h1 className="text-4xl font-bold text-center">{t('title')} - user {session?.user?.email} - {status} - {currentLocale} </h1>
    </div>
  );``
}

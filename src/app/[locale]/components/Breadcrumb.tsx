"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {useTranslations} from 'next-intl';
import { VscHome } from "react-icons/vsc";

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment && !["en", "ar"].includes(segment));
  const t = useTranslations();

  return (
    <nav className="text-gray-600 text-sm mb-4">
      <ol className="flex space-x-2">
        <li >
            
            <Link href="/" className="text-blue-500 hover:underline flex">
                <VscHome className="mr-1" />
                {t('Breadcrumb.dashboard')}
            </Link>
          
        </li>
        {pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            const isLast = index === pathSegments.length - 1;

            return (
                <li key={index} className="flex items-center">
                <span className="mx-2">/</span>
                {isLast ? (
                    <span className="text-gray-500">{t(`Breadcrumb.${segment}`)}</span>
                ) : (
                    <Link href={href} className="text-blue-500 hover:underline">
                    {t(`Breadcrumb.${segment}`)}
                    </Link>
                )}
                </li>
            );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

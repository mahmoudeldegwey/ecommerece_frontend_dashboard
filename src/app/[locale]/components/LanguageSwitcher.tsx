
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
    const currentLocale = useLocale();
    const router = useRouter();

    const switchLanguage = (locale: string) => {
        const pathname = window.location.pathname.replace(`/${currentLocale}`, ""); // Remove old locale
        router.replace(`/${locale}${pathname}`); // Redirect with new locale
        
    }

    return (
        <div>
          {currentLocale === "en" ? (
              <button
                onClick={() => switchLanguage("ar")}
                disabled={currentLocale === "ar"}
              >
                🇪🇬 العربية
              </button>
          ) : (
            <button
            onClick={() => switchLanguage("en")}
            disabled={currentLocale === "en"} >
              🇺🇸 English
            </button>
          )
          
          }
         
        
        </div>
    );
}
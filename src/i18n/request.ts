import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {

  const locale = await requestLocale; //get locale from url

  if(locale === undefined){
    return {
      locale: 'en',
      messages: (await import(`../../messages/en.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
  
});

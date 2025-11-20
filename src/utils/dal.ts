import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from './session'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  //console.log(cookie,'cookie')
  if (!session?.id) {
    redirect('/dashboard/login')
  }
 
  return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {

    const session = await verifySession()
    //console.log(session,'session')
    if (!session) return null
   
    return session.userId
  })
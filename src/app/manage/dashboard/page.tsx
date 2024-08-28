import accountApiRequest from '@/apiRequests/account'
import { AccountResType } from '@/schemaValidations/account.schema'
import { cookies } from 'next/headers'
import React from 'react'

async function Dashboard() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value!
  let data: AccountResType['data'] | undefined
  try {
    const res = await accountApiRequest.sMe(accessToken)
    data = res.payload.data
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }

  return <div>Dashboard {data?.name}</div>
}

export default Dashboard

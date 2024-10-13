'use client'

import { useAppContext } from '@/components/app-provider'
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setIsAuth } = useAppContext()
  const accessTokenFromUrl = searchParams.get('accessToken')
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const ref = useRef<any>(null)

  useEffect(() => {
    if (
      !ref.current &&
      (refreshTokenFromUrl === getRefreshTokenFromLocalStorage() ||
        accessTokenFromUrl === getAccessTokenFromLocalStorage())
    ) {
      ref.current = mutateAsync
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        setIsAuth(false)
        router.push('/login')
      })
    } else {
      router.push('/')
    }
  }, [router, mutateAsync, refreshTokenFromUrl, accessTokenFromUrl])

  return <div>Logout...</div>
}

export default Logout

'use client'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Những page sau không check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    let interval: any = null

    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          router.push('/login')
        },
      })
    }
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    onRefreshToken()
    // TIMEOUT interval phải bé hơn thời gian hết hạn của accessToken
    // ví dụ thời gian hết hạn của access token là 10s thì 1s sẽ cho check 1 lần
    const TIMEOUT = 3000
    interval = setInterval(onRefreshToken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname, router])
  return null
}

export default RefreshToken

import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { toast } from '@/components/ui/use-toast'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa ký tự '/' đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

const isClient = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => (isClient ? localStorage.getItem('accessToken') : null)

export const getRefreshTokenFromLocalStorage = () => (isClient ? localStorage.getItem('refreshToken') : null)
export const setAccessTokenToLocalStorage = (value: string) => isClient && localStorage.setItem('accessToken', value)

export const setRefreshTokenToLocalStorage = (value: string) => isClient && localStorage.setItem('refreshToken', value)
export const removeTokensFromLocalStorage = () => {
  isClient && localStorage.removeItem('accessToken')
  isClient && localStorage.removeItem('refreshToken')
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message,
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000,
    })
  }
}

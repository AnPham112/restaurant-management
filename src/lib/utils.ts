import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

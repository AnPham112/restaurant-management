import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { toast } from '@/components/ui/use-toast'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth'
import { DishStatus, OrderStatus, TableStatus } from '@/constants/type'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa ký tự '/' đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as { exp: number; iat: number }
}

const isClient = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () =>
  isClient ? localStorage.getItem('accessToken') : null
export const getRefreshTokenFromLocalStorage = () =>
  isClient ? localStorage.getItem('refreshToken') : null

export const setAccessTokenToLocalStorage = (value: string) =>
  isClient && localStorage.setItem('accessToken', value)
export const setRefreshTokenToLocalStorage = (value: string) =>
  isClient && localStorage.setItem('refreshToken', value)

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

export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  // iat là thời gian token được khởi tạo
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)
  // thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = new Date().getTime() / 1000 - 1 // - 1s thì sẽ không check decodedRefreshToken.exp <= now , nó sẽ gọi xuống api phía dưới và chạy vào catch(error) thì sẽ logout ra
  // Trường hợp refresh token hết hạn thì logout
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    return param?.onError && param.onError()
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra thời gian còn 1/3 thời gian (10 / 3 -> 3s) thì sẽ cho refresh token lại
  // Thời gian còn lại của accessToken sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của accessToken sẽ tính dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(number)
}

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus],
) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus],
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus],
) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

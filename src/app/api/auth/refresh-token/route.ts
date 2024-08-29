import authApiRequest from '@/apiRequests/auth'
import { HttpError } from '@/lib/http'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      {
        message: 'Không tìm thấy refreshToken',
      },
      {
        status: 401,
      },
    )
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken,
    })
    const newAccessToken = payload.data.accessToken
    const newRefreshToken = payload.data.refreshToken
    const decodedAccessToken = jwt.decode(newAccessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(newRefreshToken) as { exp: number }
    cookieStore.set('accessToken', newAccessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      // seconds to miliseconds
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', newRefreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      // seconds to miliseconds
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(payload)
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
      return Response.json(
        { message: error.message ?? 'Something wrong!' },
        {
          status: 401,
        },
      )
    }
  }
}

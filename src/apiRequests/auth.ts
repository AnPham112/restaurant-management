import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  cLogin: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: '',
    }),

  sLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      '/auth/logout',
      {
        resfreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.refreshToken}`,
        },
      },
    ),
  cLogout: () => {
    return http.post('/api/auth/logout', null, { baseUrl: '' })
  },
  sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
  refreshToken: () =>
    http.post('/api/auth/refresh-token', null, {
      baseUrl: '',
    }),
}

export default authApiRequest

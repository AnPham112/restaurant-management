import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
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
  // refreshToken: () =>
  //   http.post<RefreshTokenResType>('/api/auth/refresh-token', null, {
  //     baseUrl: '',
  //   }),
  // avoid duplicate api call
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/auth/refresh-token', null, {
      baseUrl: '',
    })

    const res = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return res
  },
}

export default authApiRequest

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // chưa đăng nhập thì không cho vào privatePaths đưa về trang login
  if (privatePaths.some((pp) => pathname.startsWith(pp)) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (unAuthPaths.some((up) => pathname.startsWith(up)) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  // Trường hợp đăng nhập rồi, nhwung access token lại hết hạn
  if (
    privatePaths.some((pp) => pathname.startsWith(pp)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL('/logout', request.url)
    url.searchParams.set('refreshToken', refreshToken)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login'],
}

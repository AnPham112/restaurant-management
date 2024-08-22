import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = Boolean(request.cookies.get('accessToken')?.value)
  // chưa đăng nhập thì không cho vào privatePaths đưa về trang login
  if (privatePaths.some((pp) => pathname.startsWith(pp)) && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (unAuthPaths.some((up) => pathname.startsWith(up)) && isAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login'],
}

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const cookiesStore = await cookies()
  const accessToken = cookiesStore.get('access_token')
  const refreshToken = cookiesStore.get('refresh_token')
  
  // بررسی مسیر درخواست
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isSignInRoute = request.nextUrl.pathname === '/signin'

  // اگر در مسیر dashboard هستیم و توکن‌ها وجود ندارند
  if (isDashboardRoute && (!accessToken || !refreshToken)) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // اگر در صفحه signin هستیم و توکن‌ها وجود دارند
  if (isSignInRoute && accessToken && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // برای API routes همان منطق قبلی را حفظ می‌کنیم
  // if (request.nextUrl.pathname.startsWith('/api/v1/')) {
  //   if (!accessToken || !refreshToken) {
  //     return NextResponse.json(
  //       { error: 'توکن نامعتبر' },
  //       { status: 401 }
  //     )
  //   }
  // }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // '/api/v1/:path*',
    '/dashboard/:path*',
    '/signin'
  ]
} 
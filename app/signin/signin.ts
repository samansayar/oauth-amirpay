"use server";

import { cookies } from "next/headers";

type ResponseBodyApiToken = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

const AMIRPAY_AUTH_CONFIG = {
  clientId: process.env.OAUTH_CLIENT_ID,
  secret: process.env.OAUTH_CLIENT_SECRET,
  redirectUri: "http://localhost:3001/signin",
  scope: "profile.basic subscription.manage wallet.reduce",
  authEndpoint: "http://localhost:3000/api/OAuth/authorize",
};

export interface AmirpayState {
  state?: string;
  authUrl?: string;
  message?: string;
}

export async function SigninWithAmirpayAction(
  prevState: AmirpayState,
  formData: FormData
): Promise<AmirpayState> {
  try {
    if (!AMIRPAY_AUTH_CONFIG.clientId || !AMIRPAY_AUTH_CONFIG.authEndpoint) {
      throw new Error("تنظیمات احراز هویت ناقص است");
    }

    const state = Math.random().toString(36).substring(7);

    const authUrl = new URL(AMIRPAY_AUTH_CONFIG.authEndpoint);
    authUrl.searchParams.append("client_id", AMIRPAY_AUTH_CONFIG.clientId);
    authUrl.searchParams.append(
      "redirect_uri",
      AMIRPAY_AUTH_CONFIG.redirectUri
    );
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", AMIRPAY_AUTH_CONFIG.scope);
    authUrl.searchParams.append("state", state);

    return { authUrl: authUrl.toString() };
  } catch (error) {
    console.error("خطا در SigninWithAmirpayAction:", error);
    return { message: error instanceof Error ? error.message : "خطا در اتصال به AmirPay" };
  }
}

/**
 * درخواست به api/token
 * ذخیره refresh token و access token در کوکی
 */
export async function RequestTokenSaveToCookies(code: string, state: string) {
  try {
    if (!code || !state) {
      throw new Error("کد یا state نامعتبر است");
    }

    const response = await fetch("http://localhost:3001/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: AMIRPAY_AUTH_CONFIG.clientId,
        client_secret: AMIRPAY_AUTH_CONFIG.secret,
        redirect_uri: AMIRPAY_AUTH_CONFIG.redirectUri,
        state
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `خطای سرور: ${response.status}`);
    }

    const data: ResponseBodyApiToken = await response.json();
    
    const cookiesStore = await cookies();
    try {
      cookiesStore.set('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        // expires: new Date(Date.now() + data.expires_in * 1000),
        path: '/',
      });
      
      cookiesStore.set('refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        // expires: new Date(Date.now() + data.expires_in * 1000),
        path: '/',
      });
    } catch (cookieError) {
      console.error("خطا در ذخیره‌سازی کوکی:", cookieError);
      throw new Error("خطا در ذخیره‌سازی اطلاعات احراز هویت");
    }

    return data;
  } catch (error) {
    console.error("خطا در RequestTokenSaveToCookies:", error);
    throw error;
  }
}

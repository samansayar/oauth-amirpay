"use server";
import { cookies } from "next/headers";

type TReduceWalletBalance = {
    amount: number;
    description: string;
};

const BASE_URL = "http://localhost:3000/api/OAuth";

export async function getProfile() {
    const token = await getToken();
    const response = (await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token?.access_token}`,
            "Content-Type": "application/json",
        },
    })) as Response;

    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    console.log("getProfile()", data);
    // اگر توکن منقضی شده یا نزدیک به انقضاست
    if (data.error && data.error === "insufficient_scope") {
        await refreshAccessToken();
        // دریافت مجدد پروفایل با توکن جدید
        // return getProfile();
    }

    return { ...data, ...token };
}

export async function refreshAccessToken() {
    console.log("refreshAccessToken()");
    const tokens = await getToken();

    // درخواست توکن جدید با استفاده از refresh token
    const response = await fetch(`${process.env.OAUTH_ENDPOINT}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: tokens?.refresh_token,
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            redirect_uri: process.env.OAUTH_REDIRECT_URI,
        }),
    });

    const data = await response.json();
    console.log(data);
    setCookie("access_token", data.access_token);
    setCookie("refresh_token", data.refresh_token);
}

export async function reduceWalletBalance(access_token: string, {
    amount,
    description,
}: TReduceWalletBalance) {
    try {
        // بررسی وضعیت توکن و پارامترهای ورودی
        if (!access_token) {
            throw new Error('توکن دسترسی الزامی است')
        }

        if (!amount || amount <= 0) {
            throw new Error('مبلغ باید بزرگتر از صفر باشد')
        }

        if (!description) {
            throw new Error('توضیحات الزامی است')
        }

        // Generate unique order ID with 'MGT' prefix for transaction tracking
        const orderId = `MGT-${Math.random().toString(36).substring(2, 15)}`;

        const response = await fetch(`${BASE_URL}/wallet/buy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount,
                description,
                orderId,
                secret: process.env.OAUTH_CLIENT_SECRET, // برای امنیت بیشتر در تراکنش‌ها
            })
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function setCookie(key: string, value: string) {
    (await cookies()).set(key, value);
}

export async function getToken() {
    const getAccess = (await cookies()).get("access_token");
    const getRefresh = (await cookies()).get("refresh_token");
    if (!getAccess && !getRefresh) return null;
    return { access_token: getAccess?.value, refresh_token: getRefresh?.value };
}

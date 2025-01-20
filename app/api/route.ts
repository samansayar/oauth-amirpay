import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const body = await request.json();
    const response = await fetch("http://localhost:3000/api/OAuth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            grant_type: "authorization_code",
            code: body.code,
            client_id: body.client_id,
            client_secret: body.client_secret,
            redirect_uri: body.redirect_uri,
        }),
    });

    const data = await response.json();
    console.log({ data });
    return NextResponse.json({ ...data });
}

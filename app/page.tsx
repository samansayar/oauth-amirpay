'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 flex justify-center items-center flex-col h-screen">
                <div>
                    {/* Show image logo amirpay */}
                    <Image src="https://panel.amirpay.top/img/logo.png" alt="amirpay" width={80} height={80} />
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold">Welcome to the OAuth with Amirpay</h1>
                    </div>
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground">Please click the button below to start the OAuth process</p>
                    </div>
                </div>
                <Button>
                    <Link href="/signin">
                        Start OAuth
                    </Link>
                </Button>
            </div>
        </div>
    );
}

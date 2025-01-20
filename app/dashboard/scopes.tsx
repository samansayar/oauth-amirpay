"use client"


import { Button } from '@/components/ui/button';
import { reduceWalletBalance } from '@/lib/auth';
import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

type Props = {
    profile: any
}

export default function Scopes({ profile }: Props) {
    return (
        <>
            <div className="flex items-center justify-center">
                <BuyForUser profile={profile} />
            </div>
        </>
    )
}

function BuyForUser({ profile }: { profile: any }) {
    const [loading, setLoading] = useState(false);
    const amount = 10000
    return (
        <Button
            size={"lg"}
            onClick={() => {
                setLoading(true);
                reduceWalletBalance(profile.access_token, {
                    amount,
                    description: `خرید برای ${profile.name}`,
                }).then((data) => {
                    console.log(data)
                    if (data.error) {
                        console.log(data.error)
                        toast.error(data.message || data.messages[0].message)
                    } else {
                        console.log(data)
                        toast.success("خرید با موفقیت انجام شد", {
                            description: `باقی مانده موجودی شما: ${Number(data.new_balance).toLocaleString()} تومان`
                        })
                    }
                }).catch((err) => {
                    console.error(err)
                    toast.error(err.message)
                }).finally(() => {
                    setLoading(false)
                })
            }}
            disabled={loading}
        >
            {loading ? (
                <Loader className="animate-spin" />
            ) : (
                "Pay 10,000 Tomans for " + profile.name
            )}
        </Button>
    )
}

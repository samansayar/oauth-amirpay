"use client";

import { getProfile } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import Scopes from "./scopes";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getProfile().then(setProfile);
    }, []);

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                            src={"http://localhost:3000" + profile?.avatar}
                            alt={profile?.name}
                        />
                        <AvatarFallback>
                            {profile?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{profile?.name}</h1>
                        <p className="text-sm text-muted-foreground">{profile?.phone}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* اینجا می‌توانید اطلاعات بیشتری از پروفایل را نمایش دهید */}
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Phone Number:</span>
                            <span className="text-muted-foreground">{profile?.phone}</span>
                        </div>
                        {/* سایر اطلاعات پروفایل را اینجا اضافه کنید */}
                    </div>
                </CardContent>
            </Card>
            <div className="w-3/6">
                <pre>{JSON.stringify(profile, null, 4)}</pre>
            </div>
            {profile && (
                <Scopes profile={profile} />
            )}
        </div>
    );
}

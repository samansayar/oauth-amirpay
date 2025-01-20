import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'panel.amirpay.top',
            },
        ],
    },
};

export default nextConfig;

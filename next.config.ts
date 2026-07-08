import type { NextConfig } from "next";
import * as url from "node:url";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '3mb',
        },
    },
    images: {
        remotePatterns: [new URL("https://pub-2d62febcb1a5432395df7e048ae26f35.r2.dev/**")]
    }
};

export default nextConfig;

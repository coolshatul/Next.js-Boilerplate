/** @type {import('next').NextConfig} */


const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/gpt/:path*',
                destination: 'https://mysheetai.com/:path*', // Proxy to Backend
            },
        ];
    },
};

export default nextConfig;

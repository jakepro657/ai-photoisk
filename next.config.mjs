/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  cacheOnNavigation: true,
  swSrc: "src/sw.js",
  swDest: "public/sw.js",
});

const nextConfig = {
  reactStrictMode: false,
  // TypeScript checking is done via `yarn pnpify tsc --noEmit` instead,
  // because Next.js build worker doesn't support Yarn PnP resolution for internal types
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "b22wobhlmya1ixv3.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "tong.visitkorea.or.kr",
      },
    ],
  },
};

export default withSerwist(nextConfig);

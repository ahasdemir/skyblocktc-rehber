/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Prevent access to users.json from frontend
        source: '/users.json',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Block direct access to users.json
        source: '/users.json',
        destination: '/404',
      },
    ];
  },
};

module.exports = nextConfig;
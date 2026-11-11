import type { NextConfig } from 'next';

// No GitHub Pages o site fica em /<repositório>, então o workflow de deploy
// define o prefixo. Em desenvolvimento ele fica vazio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true
};

export default nextConfig;

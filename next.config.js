/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions: true,
    },
    images: {
        domains: ['lh3.googleusercontent.com','www.medicalnewstoday.com','aarambhindia.org','i.ibb.co','pixabay.com','s3.us-west-2.amazonaws.com', "firebasestorage.googleapis.com","oaidalleapiprodscus.blob.core.windows.net"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;

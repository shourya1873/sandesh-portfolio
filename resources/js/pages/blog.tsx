import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import parse from 'html-react-parser';
import CodeRenderer from '@/components/generic/CodeRenderer';
import StoreFrontLayout from '@/layouts/storefront/StoreFrontLayout';

const Blog = () => {
    const { post } = usePage().props;

    return (
        <StoreFrontLayout>
            <Head title={post?.blog_title}>
                <title>{post?.blog_title}</title>
                <meta name="description" content="Blog Detail Page" />
                <meta property="og:title" content={post?.blog_title} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={`${import.meta.env.VITE_APP_URL}/storage/${post?.featured_image}`} />
                <meta property="og:url" content={window.location.href} />
            </Head>
            <section>
                <div className="flex h-[500px] w-full items-center justify-center">
                    <h1 className="text-6xl font-bold transition-colors duration-150 hover:text-[#ff014f] cursor-pointer mx-10 text-center">{post?.blog_title}</h1>
                </div>
                <div className={'mx-20 flex justify-center items-center'}>
                    <CodeRenderer html={post?.content} />
                </div>
            </section>
        </StoreFrontLayout>
    );
};

export default Blog;

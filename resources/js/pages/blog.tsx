import React from 'react';
import { usePage } from '@inertiajs/react';
import parse from 'html-react-parser';
import CodeRenderer from '@/components/generic/CodeRenderer';
import StoreFrontLayout from '@/layouts/storefront/StoreFrontLayout';

const Blog = () => {
    const { post } = usePage().props;
    console.log(post);
    return (
        <StoreFrontLayout>
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

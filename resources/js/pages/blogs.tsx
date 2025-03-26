import StoreFrontLayout from '@/layouts/storefront/StoreFrontLayout';
import { usePage, router, Head, Link } from '@inertiajs/react';
import CustomPagination from '@/components/generic/Pagination';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, Tag } from 'lucide-react';

interface Post {
    id: number;
    blog_title: string;
    content: string;
    featured_image: string | null;
    created_at: string;
    updated_at: string;
    tags: string;
    url_key: string;
}

interface PageProps {
    data?: Post[];
}


const Blogs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let params = new URLSearchParams(window.location.search);
    const [pageNumber, setPageNumber] = useState(parseInt(params.get('p') || '1'));
    const { posts } = usePage().props;

    const onClickPaginate = (pageNumber: String) => {
        setSearchParams({ ['p']: pageNumber });
        console.log(window.document.URL);
        router.get(window.document.URL);
    };

    const truncate = (text: string, length: number) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
        <StoreFrontLayout>
            <Head title={'Blogs Page'}>
                <title>Blogs Page</title>
                <meta name="description" content="All the blogs listing page" />
            </Head>
            <section>
                <div className="flex h-[400px] w-full items-center justify-center">
                    <h1 className="text-6xl font-bold transition-colors duration-150 hover:text-[#ff014f]">Blogs</h1>
                </div>
                <div className={'flex flex-col gap-4'}>
                    {posts?.data?.map((post: Post) => <div key={post.id}>
                        <div
                            className="bg-[#121212] text-white rounded-2xl overflow-hidden shadow-lg max-w-[350px] h-[400px] sm:max-w-[600px] sm:h-[450px] lg:max-w-[840px] lg:h-[700px] mx-auto hover:border hover:border-[#ff014f] hover:shadow-lg hover:shadow-[#ff014f]/50 transition-all duration-300">
                            {/* Image */}
                            <Link href={`/blog/${post?.url_key}`}>
                                <img
                                    src={post?.featured_image} // replace with your image path
                                    alt={post?.blog_title}
                                    className="w-full h-[150px] sm:h-[256px] lg:h-[456px] object-cover"
                                />
                            </Link>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Tags */}
                                {post?.tags && (
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                        {post?.tags?.split(',')?.map((tag: string, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Tag className="w-4 h-4" />
                                                <span>{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}


                                {/* Title */}
                                <h2 className="text-2xl sm:text-3xl font-bold leading-tight cursor-pointer hover:text-[#ff014f] transition-colors duration-200">
                                    <Link href={`/blog/${post?.url_key}`}>
                                        {post.blog_title}
                                    </Link>
                                </h2>

                                {/* Read More Button */}
                                <Link href={`/blog/${post?.url_key}`}
                                        className="flex font-bold w-fit text-gray-500 hover:text-white items-center gap-2 px-4 py-2 border border-gray-600 rounded-full text-sm hover:bg-[#ff014f] transition-colors duration-200 cursor-pointer">
                                    Read More <span className="ml-1">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>)}
                </div>
                <CustomPagination totalPages={posts?.last_page} page={posts?.current_page} onClick={onClickPaginate} />
            </section>
        </StoreFrontLayout>
    );
};

export default Blogs;

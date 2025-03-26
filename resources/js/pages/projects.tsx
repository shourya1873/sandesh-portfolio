import StoreFrontLayout from '@/layouts/storefront/StoreFrontLayout';
import { usePage, router, Head, Link } from '@inertiajs/react';
import CustomPagination from '@/components/generic/Pagination';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, Tag } from 'lucide-react';


const Projects = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let params = new URLSearchParams(window.location.search);
    const [pageNumber, setPageNumber] = useState(parseInt(params.get('p') || '1'));
    const { projects } = usePage().props;

    const onClickPaginate = (pageNumber: String) => {
        setSearchParams({ ['p']: pageNumber });
        router.get(window.document.URL);
    };

    const truncate = (text: string, length: number) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
    };
    console.log(projects);
    return (
        <StoreFrontLayout>
            <Head title={'Projects Page'}>
                <title>Projects Page</title>
                <meta name="description" content="All the Projects listing page" />
            </Head>
            <section>
                <div className="flex h-[400px] w-full items-center justify-center">
                    <h1 className="text-6xl font-bold transition-colors duration-150 hover:text-[#ff014f]">Projects</h1>
                </div>
                <div className={'flex flex-col gap-4'}>
                    {projects?.data?.map((project) => <div key={project.id}>
                            <div
                                className="bg-[#121212] text-white rounded-2xl overflow-hidden shadow-lg max-w-[350px] h-[400px] sm:max-w-[600px] sm:h-[450px] lg:max-w-[840px] lg:h-[700px] mx-auto hover:border hover:border-[#ff014f] hover:shadow-lg hover:shadow-[#ff014f]/50 transition-all duration-300 flex flex-col"
                            >
                                {/* Image */}
                                <Link href={`/project/${project?.url_key}`}>
                                    <img
                                        src={project?.featured_image}
                                        alt={project?.name}
                                        className="w-full h-[250px] sm:h-[256px] lg:h-[456px] object-cover"
                                    />
                                </Link>

                                {/* Content Section */}
                                <div className="flex flex-col justify-between flex-1 p-6">
                                    {/* Top Content */}
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold leading-tight cursor-pointer hover:text-[#ff014f] transition-colors duration-200">
                                            <Link href={`/project/${project?.url_key}`}>
                                                {project.name}
                                            </Link>
                                        </h2>
                                        <div className="mt-2 text-sm text-gray-300">
                                            {project?.short_description}
                                        </div>
                                    </div>

                                    {/* Read More Button */}
                                    <Link
                                        href={`/project/${project?.url_key}`}
                                        className="mt-6 flex font-bold w-fit text-gray-500 hover:text-white items-center gap-2 px-4 py-2 border border-gray-600 rounded-full text-sm hover:bg-[#ff014f] transition-colors duration-200 cursor-pointer"
                                    >
                                        Read More <span className="ml-1">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <CustomPagination totalPages={projects?.last_page} page={projects?.current_page}
                                  onClick={onClickPaginate} />
            </section>
        </StoreFrontLayout>
    );
};

export default Projects;

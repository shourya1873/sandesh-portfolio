import React from 'react';
import { usePage } from '@inertiajs/react';
import CodeRenderer from '@/components/generic/CodeRenderer';
import StoreFrontLayout from '@/layouts/storefront/StoreFrontLayout';

const Project = () => {
    const { project } = usePage().props;

    return (
        <StoreFrontLayout>
            <section>
                <div className="flex h-[400px] w-full items-center justify-center">
                    <h1 className="text-6xl font-bold transition-colors duration-150 hover:text-[#ff014f] cursor-pointer mx-10 text-center">{project?.name}</h1>
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <div>
                        <img
                            src={`${import.meta.env.VITE_APP_URL}/${project?.featured_image}`}
                            alt={project?.name}
                            className="w-full sm:h-[356px] lg:h-[556px] object-cover"
                        />
                    </div>
                    <div className={'my-20 flex justify-center items-center'}>
                        <CodeRenderer html={project?.content} />
                    </div>
                </div>
            </section>
        </StoreFrontLayout>
    );
};

export default Project;

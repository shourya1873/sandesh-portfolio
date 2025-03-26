import React, { useState, useEffect } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { useSearchParams } from 'react-router-dom';
import { router } from '@inertiajs/react';

interface PaginationProps {
    totalPages: number;
    page: number;
    onClick: (pageNumber: number) => void;
}

const CustomPagination = ({ totalPages, page, onClick }: PaginationProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // Keep currentPage in sync with searchParams
        const currentPage = parseInt(searchParams.get('p') || '1');
        if (currentPage !== page) {
            onClick(currentPage);
        }
    }, [searchParams]);

    const increasePageNumber = () => {
        const pageNumber = parseInt(searchParams.get('p') || '1');
        if (pageNumber < totalPages) {
            setSearchParams({ p: (pageNumber + 1).toString() });
            router.get(window.location.pathname + `?p=${pageNumber + 1}`);
        }
    };

    const decreasePageNumber = () => {
        const pageNumber = parseInt(searchParams.get('p') || '1');
        if (pageNumber > 1) {
            setSearchParams({ p: (pageNumber - 1).toString() });
            router.get(window.location.pathname + `?p=${pageNumber - 1}`);
        }
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Pagination className={'my-6'}>
            <PaginationContent>
                <PaginationItem
                    className={`min-w-[40px] text-center ${
                        page <= 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                >
                    <PaginationPrevious
                        onClick={decreasePageNumber}
                        disabled={page <= 1}
                    />
                </PaginationItem>

                {pageNumbers.map((number) => (
                    <PaginationItem
                        key={number}
                        className="cursor-pointer min-w-[40px] text-center"
                    >
                        <PaginationLink
                            isActive={number === page}
                            onClick={() => onClick(number)}
                        >
                            {number}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem
                    className={`min-w-[40px] text-center ${
                        page >= totalPages ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                >
                    <PaginationNext
                        onClick={increasePageNumber}
                        disabled={page >= totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;

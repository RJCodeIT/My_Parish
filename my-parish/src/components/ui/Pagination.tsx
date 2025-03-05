"use client"
import { useState } from 'react';

interface PaginationProps {
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export default function Pagination({ itemsPerPage, onPageChange, totalItems }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-12 h-12 flex items-center justify-center rounded-xl font-semibold text-lg transition-all ${
            currentPage === i
              ? 'bg-secondary/20 text-primary shadow-lg scale-110 border-2 border-secondary font-bold'
              : 'bg-white text-primary hover:bg-neutral/10 border-2 border-neutral/20 hover:border-neutral/50'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-all ${
          currentPage === 1
            ? 'bg-neutral/10 text-neutral/40 cursor-not-allowed border-2 border-neutral/20'
            : 'bg-white text-primary hover:bg-neutral/10 border-2 border-neutral/20 hover:border-neutral/50'
        }`}
      >
        «
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-all ${
          currentPage === 1
            ? 'bg-neutral/10 text-neutral/40 cursor-not-allowed border-2 border-neutral/20'
            : 'bg-white text-primary hover:bg-neutral/10 border-2 border-neutral/20 hover:border-neutral/50'
        }`}
      >
        ‹
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-all ${
          currentPage === totalPages
            ? 'bg-neutral/10 text-neutral/40 cursor-not-allowed border-2 border-neutral/20'
            : 'bg-white text-primary hover:bg-neutral/10 border-2 border-neutral/20 hover:border-neutral/50'
        }`}
      >
        ›
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-all ${
          currentPage === totalPages
            ? 'bg-neutral/10 text-neutral/40 cursor-not-allowed border-2 border-neutral/20'
            : 'bg-white text-primary hover:bg-neutral/10 border-2 border-neutral/20 hover:border-neutral/50'
        }`}
      >
        »
      </button>
    </div>
  );
}
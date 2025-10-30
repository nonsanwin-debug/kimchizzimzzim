
import React from 'react';
import type { FilterType } from '../types';

interface FilterControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ searchTerm, setSearchTerm, filter, setFilter }) => {
    
    const filterOptions: { value: FilterType; label: string }[] = [
        { value: 'all', label: '전체' },
        { value: 'in-stock', label: '재고 양호' },
        { value: 'low', label: '재고 부족' },
        { value: 'out-of-stock', label: '품절' },
    ];

    return (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-auto sm:flex-grow">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    type="text"
                    placeholder="품목 이름으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                {filterOptions.map(option => (
                     <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                            filter === option.value
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterControls;

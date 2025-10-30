
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                    <i className="fas fa-boxes-stacked mr-3 text-blue-600"></i>
                    스마트 재고 관리
                </h1>
                <p className="text-sm text-gray-500 mt-1">배달 전문점을 위한 AI 재고 관리 솔루션</p>
            </div>
        </header>
    );
};

export default Header;


import React from 'react';
import type { InventoryItem } from '../types';
import { StockStatus } from '../types';
import { PencilIcon, TrashIcon } from '../constants';

interface InventoryItemCardProps {
    item: InventoryItem;
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
    onStockUpdate: (id: string, newQuantity: number) => void;
}

const getStatusInfo = (quantity: number, threshold: number): { status: StockStatus; color: string; label: string } => {
    if (quantity === 0) {
        return { status: StockStatus.OutOfStock, color: 'bg-red-100 text-red-800 border-red-500', label: '품절' };
    }
    if (quantity <= threshold) {
        return { status: StockStatus.LowStock, color: 'bg-yellow-100 text-yellow-800 border-yellow-500', label: '재고 부족' };
    }
    return { status: StockStatus.InStock, color: 'bg-green-100 text-green-800 border-green-500', label: '재고 양호' };
};


const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onEdit, onDelete, onStockUpdate }) => {
    const { status, color, label } = getStatusInfo(item.quantity, item.lowStockThreshold);

    const handleQuantityChange = (delta: number) => {
        const newQuantity = Math.max(0, item.quantity + delta);
        onStockUpdate(item.id, newQuantity);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-5 flex flex-col justify-between border-l-4 ${status === StockStatus.OutOfStock ? 'border-red-500' : status === StockStatus.LowStock ? 'border-yellow-500' : 'border-green-500'}`}>
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 break-words">{item.name}</h3>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
                        {label}
                    </div>
                </div>
                
                <div className="mt-4 text-gray-600">
                    <p className="text-3xl font-mono text-center my-4">
                        <span className="font-bold">{item.quantity}</span>
                        <span className="text-lg ml-2">{item.unit}</span>
                    </p>
                    <div className="text-sm text-center text-gray-500">
                        부족 기준: {item.lowStockThreshold} {item.unit}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300 transition"
                        aria-label="재고 감소"
                    >
                        -
                    </button>
                    <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300 transition"
                        aria-label="재고 증가"
                    >
                        +
                    </button>
                </div>

                <div className="text-xs text-center text-gray-400 mt-2">
                    최근 업데이트: {new Date(item.lastUpdated).toLocaleString('ko-KR')}
                </div>
            </div>

            <div className="flex justify-end items-center gap-2 mt-5 pt-4 border-t border-gray-200">
                <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                    aria-label="수정"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"
                    aria-label="삭제"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default InventoryItemCard;

import React from 'react';
import type { InventoryItem } from '../types';
import InventoryItemCard from './InventoryItemCard';

interface InventoryListProps {
    inventory: InventoryItem[];
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
    onStockUpdate: (id: string, newQuantity: number) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ inventory, onEdit, onDelete, onStockUpdate }) => {
    if (inventory.length === 0) {
        return (
            <div className="text-center py-20">
                <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700">재고 품목이 없습니다.</h3>
                <p className="text-gray-500 mt-2">오른쪽 하단의 '+' 버튼을 눌러 새 품목을 추가하세요.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {inventory.map(item => (
                <InventoryItemCard
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStockUpdate={onStockUpdate}
                />
            ))}
        </div>
    );
};

export default InventoryList;
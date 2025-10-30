
import React, { useState, useMemo, useCallback } from 'react';
import { useInventory } from './hooks/useInventory';
import type { InventoryItem, FilterType, InventoryItemData } from './types';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import InventoryList from './components/InventoryList';
import ItemFormModal from './components/ItemFormModal';
import { PlusIcon } from './constants';

const App: React.FC = () => {
    const {
        inventory,
        addItem,
        updateItem,
        deleteItem,
        updateStock,
    } = useInventory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');

    const handleOpenModal = (item?: InventoryItem) => {
        setEditingItem(item || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = (itemData: InventoryItemData | InventoryItem) => {
        if ('id' in itemData) {
            updateItem(itemData.id, itemData);
        } else {
            addItem(itemData);
        }
        handleCloseModal();
    };

    const handleDeleteItem = (id: string) => {
        if (window.confirm('정말로 이 품목을 삭제하시겠습니까?')) {
            deleteItem(id);
        }
    };
    
    const filteredInventory = useMemo(() => {
        return inventory
            .filter(item => {
                if (filter === 'all') return true;
                const status = item.quantity === 0 ? 'out-of-stock' : item.quantity <= item.lowStockThreshold ? 'low' : 'in-stock';
                return filter === status;
            })
            .filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [inventory, filter, searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                  <FilterControls
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      filter={filter}
                      setFilter={setFilter}
                  />
                  <InventoryList
                      inventory={filteredInventory}
                      onEdit={handleOpenModal}
                      onDelete={handleDeleteItem}
                      onStockUpdate={updateStock}
                  />
                </div>
            </main>

            {isModalOpen && (
                <ItemFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveItem}
                    item={editingItem}
                />
            )}

            <div className="fixed bottom-6 right-6">
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    aria-label="새 품목 추가"
                >
                    <PlusIcon className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
};

export default App;
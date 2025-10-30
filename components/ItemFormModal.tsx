
import React, { useState, useEffect } from 'react';
import type { InventoryItem, InventoryItemData } from '../types';
import { suggestItemDetails } from '../services/geminiService';
import { SparklesIcon } from '../constants';
import Spinner from './Spinner';

interface ItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: InventoryItemData | InventoryItem) => void;
    item?: InventoryItem | null;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(0);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.name);
            setQuantity(item.quantity);
            setUnit(item.unit);
            setLowStockThreshold(item.lowStockThreshold);
        } else {
            setName('');
            setQuantity(0);
            setUnit('');
            setLowStockThreshold(0);
        }
    }, [item]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const itemData = {
            name,
            quantity: Number(quantity),
            unit,
            lowStockThreshold: Number(lowStockThreshold),
        };
        if (item) {
            onSave({ ...item, ...itemData });
        } else {
            onSave(itemData);
        }
    };

    const handleAiSuggest = async () => {
        if (!name) {
            setAiError("품목 이름을 먼저 입력해주세요.");
            return;
        }
        setIsAiLoading(true);
        setAiError('');
        try {
            const suggestion = await suggestItemDetails(name);
            if (suggestion) {
                setUnit(suggestion.unit);
                setLowStockThreshold(suggestion.lowStockThreshold);
            }
        } catch (error) {
            console.error(error);
            setAiError("AI 추천을 받는데 실패했습니다.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{item ? '품목 수정' : '새 품목 추가'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">품목 이름</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">단위 (e.g., kg, 개)</label>
                                <input type="text" id="unit" value={unit} onChange={e => setUnit(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">재고 부족 기준</label>
                                <input type="number" id="lowStockThreshold" value={lowStockThreshold} min="0" onChange={e => setLowStockThreshold(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                        </div>

                        <div>
                           <button type="button" onClick={handleAiSuggest} disabled={isAiLoading || !name} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isAiLoading ? (
                                    <>
                                        <Spinner />
                                        <span>AI가 추천 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        <span>단위 & 기준 AI 추천받기</span>
                                    </>
                                )}
                            </button>
                            {aiError && <p className="text-red-500 text-xs mt-1">{aiError}</p>}
                        </div>

                         <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">현재 수량</label>
                            <input type="number" id="quantity" value={quantity} min="0" onChange={e => setQuantity(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">취소</button>
                        <button type="submit" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemFormModal;

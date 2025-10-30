
import { useState, useEffect, useCallback } from 'react';
import type { InventoryItem, InventoryItemData } from '../types';

const INVENTORY_STORAGE_KEY = 'delivery_inventory';

const initialInventory: InventoryItem[] = [
    { id: '1', name: '삼겹살', quantity: 10, unit: 'kg', lowStockThreshold: 5, lastUpdated: new Date().toISOString() },
    { id: '2', name: '배달용기(대)', quantity: 50, unit: '개', lowStockThreshold: 100, lastUpdated: new Date().toISOString() },
    { id: '3', name: '김치', quantity: 2, unit: 'kg', lowStockThreshold: 5, lastUpdated: new Date().toISOString() },
    { id: '4', name: '공기밥', quantity: 0, unit: '개', lowStockThreshold: 10, lastUpdated: new Date().toISOString() },
];

export const useInventory = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        try {
            const localData = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
            return localData ? JSON.parse(localData) : initialInventory;
        } catch (error) {
            console.error("Could not parse inventory from localStorage", error);
            return initialInventory;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
        } catch (error) {
            console.error("Could not save inventory to localStorage", error);
        }
    }, [inventory]);

    const addItem = useCallback((itemData: InventoryItemData) => {
        const newItem: InventoryItem = {
            ...itemData,
            id: new Date().getTime().toString(),
            lastUpdated: new Date().toISOString(),
        };
        setInventory(prevInventory => [...prevInventory, newItem]);
    }, []);

    const updateItem = useCallback((id: string, updatedData: Partial<InventoryItemData>) => {
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === id ? { ...item, ...updatedData, lastUpdated: new Date().toISOString() } : item
            )
        );
    }, []);

    const deleteItem = useCallback((id: string) => {
        setInventory(prevInventory => prevInventory.filter(item => item.id !== id));
    }, []);

    const updateStock = useCallback((id: string, newQuantity: number) => {
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === id ? { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString() } : item
            )
        );
    }, []);

    return { inventory, addItem, updateItem, deleteItem, updateStock };
};

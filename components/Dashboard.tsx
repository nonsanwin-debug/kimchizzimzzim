
import React, { useMemo } from 'react';
import type { InventoryItem } from '../types';

interface DashboardProps {
    inventory: InventoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ inventory }) => {
    const stats = useMemo(() => {
        const totalItems = inventory.length;
        const lowStockItems = inventory.filter(
            item => item.quantity > 0 && item.quantity <= item.lowStockThreshold
        ).length;
        const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
        return { totalItems, lowStockItems, outOfStockItems };
    }, [inventory]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <DashboardCard
                title="총 품목 수"
                value={stats.totalItems}
                icon="fas fa-list"
                color="bg-blue-500"
            />
            <DashboardCard
                title="재고 부족"
                value={stats.lowStockItems}
                icon="fas fa-exclamation-triangle"
                color="bg-yellow-500"
            />
            <DashboardCard
                title="품절"
                value={stats.outOfStockItems}
                icon="fas fa-ban"
                color="bg-red-500"
            />
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: string;
    color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:-translate-y-1">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${color}`}>
                <i className={`${icon} text-2xl`}></i>
            </div>
        </div>
    );
};

export default Dashboard;

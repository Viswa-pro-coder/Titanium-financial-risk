'use client';

import React, { useMemo } from 'react';
import { BatchUpload } from '@/components/dashboard/analyst/batch-upload';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

export default function B2ProPage() {
    // Fetch real data from Firestore  
    const { data: cases, loading: loadingCases } = useFirestoreCollection('cases');

    // Calculate summary stats from real data
    const analytics = useMemo(() => {
        if (loadingCases) {
            return [
                { title: "Active Clients", value: "...", change: "" },
                { title: "Critical Cases", value: "...", change: "" },
                { title: "Average Risk", value: "...", change: "" },
                { title: "Monthly Revenue", value: "...", change: "" },
            ];
        }

        const activeClients = cases.length;
        const criticalCases = cases.filter(c => (c.riskScore || 0) > 80).length;
        const avgRisk = cases.length > 0
            ? Math.round(cases.reduce((sum, c) => sum + (c.riskScore || 0), 0) / cases.length)
            : 0;

        return [
            { title: "Active Clients", value: activeClients.toString(), change: "+12%" },
            { title: "Critical Cases", value: criticalCases.toString(), change: "-5%" },
            { title: "Average Risk", value: avgRisk.toString(), change: "-2%" },
            { title: "Monthly Revenue", value: "$1.2M", change: "+8%" },
        ];
    }, [cases, loadingCases]);

    // Organize cases by risk level for Kanban
    const kanbanColumns = useMemo(() => {
        if (loadingCases || cases.length === 0) {
            // Fallback to mock data
            return [
                { title: "Low Risk", color: "border-emerald-500", items: ["Client A - Audit", "Client B - Review"] },
                { title: "Medium Risk", color: "border-amber-500", items: ["Client D - Flagged Tx"] },
                { title: "High Risk", color: "border-rose-500", items: ["Client F - AML Alert"] },
                { title: "Critical", color: "border-purple-600", items: ["Client H - Fraud Case"] },
            ];
        }

        const lowRisk = cases.filter(c => (c.riskScore || 0) <= 40);
        const mediumRisk = cases.filter(c => (c.riskScore || 0) > 40 && (c.riskScore || 0) <= 70);
        const highRisk = cases.filter(c => (c.riskScore || 0) > 70 && (c.riskScore || 0) <= 85);
        const critical = cases.filter(c => (c.riskScore || 0) > 85);

        return [
            {
                title: "Low Risk",
                color: "border-emerald-500",
                items: lowRisk.slice(0, 5).map(c => ({
                    id: c.id,
                    name: c.clientName || c.customerId || `Case ${c.id}`,
                    description: c.description || 'Routine review'
                }))
            },
            {
                title: "Medium Risk",
                color: "border-amber-500",
                items: mediumRisk.slice(0, 5).map(c => ({
                    id: c.id,
                    name: c.clientName || c.customerId || `Case ${c.id}`,
                    description: c.description || 'Review needed'
                }))
            },
            {
                title: "High Risk",
                color: "border-rose-500",
                items: highRisk.slice(0, 5).map(c => ({
                    id: c.id,
                    name: c.clientName || c.customerId || `Case ${c.id}`,
                    description: c.description || 'High priority'
                }))
            },
            {
                title: "Critical",
                color: "border-purple-600",
                items: critical.slice(0, 5).map(c => ({
                    id: c.id,
                    name: c.clientName || c.customerId || `Case ${c.id}`,
                    description: c.description || 'Immediate action required'
                }))
            },
        ];
    }, [cases, loadingCases]);

    return (
        <div className="p-8 space-y-8 bg-black/5 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900">Analyst Workbench</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analytics.map((item, index) => (
                    <div key={index} className="bg-slate-900 p-6 rounded-xl shadow-lg text-white">
                        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{item.title}</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold">{item.value}</span>
                            {item.change && (
                                <span className={`text-sm ${item.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {item.change}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kanban Board */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Case Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                        {kanbanColumns.map((col, idx) => (
                            <div key={idx} className={`bg-gray-100/50 p-4 rounded-lg flex flex-col h-[500px] border-t-4 ${col.color}`}>
                                <h3 className="font-semibold text-gray-700 mb-4">{col.title} ({col.items.length})</h3>
                                <div className="space-y-3 flex-1 overflow-y-auto">
                                    {col.items.map((item: any, i: number) => (
                                        <div key={i} className="bg-white p-3 rounded shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing border border-gray-200">
                                            <p className="text-sm font-medium text-gray-800">
                                                {typeof item === 'string' ? item : item.name}
                                            </p>
                                            {typeof item !== 'string' && (
                                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                            )}
                                            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                                <span>ID: #{typeof item === 'string' ? 1000 + i : item.id?.slice(0, 6)}</span>
                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded">2h ago</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded text-sm hover:bg-gray-50 hover:text-gray-700 flex items-center justify-center gap-2">
                                        + Add Case
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CSV Upload Section */}
                <div className="space-y-6">
                    <div className="h-full">
                        <BatchUpload />
                    </div>
                </div>
            </div>
        </div>
    );
}


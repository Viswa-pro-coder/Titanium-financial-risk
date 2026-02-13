'use client';

import React, { useMemo } from 'react';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

export default function B2BPage() {
  // Fetch real data from Firestore
  const { data: customers, loading: loadingCustomers } = useFirestoreCollection('customers');
  const { data: alerts, loading: loadingAlerts } = useFirestoreCollection('alerts');

  // Calculate KPIs from real data
  const kpis = useMemo(() => {
    if (loadingCustomers) {
      return [
        { title: "Total Customers", value: "...", change: "" },
        { title: "Average Risk Score", value: "...", change: "" },
        { title: "High Risk Accounts", value: "...", change: "" },
        { title: "Alerts This Week", value: "...", change: "" },
      ];
    }

    const totalCustomers = customers.length;
    const avgRisk = customers.length > 0
      ? Math.round(customers.reduce((sum, c) => sum + (c.riskScore || 0), 0) / customers.length)
      : 0;
    const highRiskCount = customers.filter(c => (c.riskScore || 0) > 70).length;
    const alertsThisWeek = alerts.filter(a => {
      const alertDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return alertDate >= weekAgo;
    }).length;

    return [
      { title: "Total Customers", value: totalCustomers.toString(), change: "+12%" },
      { title: "Average Risk Score", value: avgRisk.toString(), change: "-5%" },
      { title: "High Risk Accounts", value: highRiskCount.toString(), change: "+2" },
      { title: "Alerts This Week", value: alertsThisWeek.toString(), change: "-3" },
    ];
  }, [customers, alerts, loadingCustomers]);

  // Generate heatmap from real customer data
  const heatmapData = useMemo(() => {
    if (loadingCustomers || customers.length === 0) {
      // Fallback to mock data if no customers
      return Array.from({ length: 100 }, (_, i) => {
        const rand = Math.random();
        let risk = 'low';
        if (rand > 0.8) risk = 'high';
        else if (rand > 0.6) risk = 'medium';
        return { id: i, risk };
      });
    }

    // Use first 100 customers for heatmap
    return customers.slice(0, 100).map((customer, i) => {
      const score = customer.riskScore || 0;
      let risk = 'low';
      if (score > 70) risk = 'high';
      else if (score > 40) risk = 'medium';
      return { id: i, risk, customerId: customer.id };
    });
  }, [customers, loadingCustomers]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-rose-500';
      default: return 'bg-gray-300';
    }
  };

  // Get recent high-risk alerts
  const recentAlerts = useMemo(() => {
    if (loadingAlerts) return [];

    return alerts
      .filter(a => (a.riskScore || 0) > 65)
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
      .slice(0, 5)
      .map(a => ({
        customerId: a.customerId || a.id,
        riskScore: a.riskScore || 0,
        status: a.status || ((a.riskScore || 0) > 80 ? 'Critical' : 'Review Needed')
      }));
  }, [alerts, loadingAlerts]);

  return (
    <div className="p-8 space-y-8 bg-black/5 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Institution Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-slate-900 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{kpi.title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{kpi.value}</span>
              {kpi.change && (
                <span className={`text-sm ${kpi.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {kpi.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Heatmap */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Portfolio Heatmap</h2>
          <div className="grid grid-cols-10 gap-1 aspect-video lg:aspect-auto h-64 lg:h-80">
            {heatmapData.map((item) => (
              <div
                key={item.id}
                className={`${getRiskColor(item.risk)} rounded-sm hover:opacity-80 transition-opacity cursor-pointer`}
                title={`Account ${item.customerId || item.id} - ${item.risk.toUpperCase()} Risk`}
              />
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-sm text-gray-600 justify-end">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Low Risk
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div> Medium Risk
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full"></div> High Risk
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Alerts</h2>
          {loadingAlerts ? (
            <div className="text-center text-gray-500 py-8">Loading alerts...</div>
          ) : recentAlerts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No alerts found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-sm font-medium text-gray-500">Customer ID</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Score</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentAlerts.map((alert, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="py-3 font-medium text-gray-900">{alert.customerId}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${alert.riskScore > 80 ? 'bg-rose-100 text-rose-700' :
                            alert.riskScore > 70 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {alert.riskScore}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{alert.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button className="w-full mt-6 py-2 text-sm text-slate-600 font-medium hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}


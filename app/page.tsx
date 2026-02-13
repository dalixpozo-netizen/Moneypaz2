"use client";

import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  Calendar, 
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  // Datos de ejemplo para que veas cómo queda
  const [alerts] = useState([
    { id: 1, name: 'Alquiler', amount: 850, date: 'En 2 días', type: 'Fijo' },
    { id: 2, name: 'Suscripción Netflix', amount: 15.99, date: 'Mañana', type: 'Ocio' },
    { id: 3, name: 'Factura Luz', amount: 65.40, date: 'En 1 semana', type: 'Servicios' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Cabecera */}
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moneypaz</h1>
          <p className="text-gray-500">Hola jefe, así van tus finanzas hoy.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} />
          Nuevo Gasto
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Resumen de Saldo */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Ingresos Mensuales</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">2.450,00€</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <TrendingDown size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Gastos Mensuales</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">1.120,50€</p>
          </div>

          <div className="sm:col-span-2 bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm mb-1 font-medium">Saldo Total Disponible</p>
                <p className="text-4xl font-bold">1.329,50€</p>
              </div>
              <Wallet size={32} className="opacity-50" />
            </div>
          </div>
        </div>

        {/* SECCIÓN DE ALERTAS (Tu nueva función) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell size={20} className="text-yellow-500" />
              Próximas Alertas
            </h2>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
              {alerts.length} pendientes
            </span>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition border border-transparent hover:border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Clock size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{alert.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {alert.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">-{alert.amount}€</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{alert.type}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition">
            Configurar nuevo recordatorio
          </button>
        </div>

      </main>
    </div>
  );
}

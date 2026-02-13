"use client";

import React, { useState } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Bell, 
  Calendar, Plus, Clock, X, CheckCircle2, ArrowDownCircle, ArrowUpCircle
} from 'lucide-react';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'ingreso' | 'gasto';
  category: string;
  date: string;
  hasAlert: boolean;
  alertDaysBefore: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados del formulario
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ingreso' | 'gasto'>('gasto');
  const [category, setCategory] = useState('General');
  const [hasAlert, setHasAlert] = useState(false);
  const [alertDays, setAlertDays] = useState(0);

  // Cálculos dinámicos
  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((acc, curr) => acc + curr.amount, 0);
  const totalGastos = transactions.filter(t => t.type === 'gasto').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIngresos - totalGastos;
  const activeAlerts = transactions.filter(t => t.hasAlert);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString('es-ES'),
      hasAlert: type === 'gasto' ? hasAlert : false,
      alertDaysBefore: alertDays
    };

    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
    setShowSuccess(true);
    
    // Reset
    setName(''); setAmount(''); setHasAlert(false); setType('gasto');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce z-50">
          <CheckCircle2 size={20} /> ¡Registro guardado con éxito!
        </div>
      )}

      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moneypaz</h1>
          <p className="text-gray-500 text-sm">Gestión de Ingresos y Gastos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
        >
          <Plus size={20} /> Añadir Movimiento
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <ArrowUpCircle size={18} />
                <span className="text-xs font-bold uppercase">Ingresos Totales</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{totalIngresos.toLocaleString('es-ES')}€</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <ArrowDownCircle size={18} />
                <span className="text-xs font-bold uppercase">Gastos Totales</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{totalGastos.toLocaleString('es-ES')}€</p>
            </div>

            <div className="sm:col-span-2 bg-slate-900 p-8 rounded-3xl text-white">
              <p className="text-slate-400 text-sm mb-1 font-medium">Balance Neto</p>
              <p className={`text-5xl font-black ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                {balance.toLocaleString('es-ES')}€
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between">
              <h3 className="font-bold text-gray-700">Historial de Movimientos</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {transactions.length === 0 ? (
                <p className="p-10 text-center text-gray-400 text-sm italic">Sin movimientos registrados.</p>
              ) : (
                transactions.map(t => (
                  <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${t.type === 'ingreso' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {t.type === 'ingreso' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.date} • {t.category}</p>
                      </div>
                    </div>
                    <p className={`font-black ${t.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'ingreso' ? '+' : '-'}{t.amount}€
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ASISTENTE DE ALERTAS */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ring-4 ring-yellow-50/50 h-fit">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Bell size={22} className="text-yellow-500 fill-yellow-500" />
            Alertas Activas
          </h2>
          <div className="space-y-4">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
                <p className="text-[10px] font-black text-yellow-700 uppercase mb-1">Aviso {alert.alertDaysBefore} días antes</p>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-900 text-sm">{alert.name}</p>
                  <p className="font-bold text-orange-700 text-sm">{alert.amount}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Nuevo Movimiento</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  type="button" onClick={() => setType('gasto')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${type === 'gasto' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                >Gasto</button>
                <button 
                  type="button" onClick={() => setType('ingreso')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${type === 'ingreso' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                >Ingreso</button>
              </div>
              
              <input 
                required value={name} onChange={e => setName(e.target.value)}
                placeholder="Concepto (ej: Sueldo, Alquiler...)" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <input 
                required value={amount} onChange={e => setAmount(e.target.value)}
                type="number" step="0.01" placeholder="Importe 0.00€" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />

              {type === 'gasto' && (
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={hasAlert} onChange={e => setHasAlert(e.target.checked)} className="w-5 h-5 rounded" />
                    <span className="font-bold text-blue-800 text-sm">¿Recordar próximo pago?</span>
                  </label>
                  {hasAlert && (
                    <select 
                      value={alertDays} onChange={e => setAlertDays(parseInt(e.target.value))}
                      className="w-full mt-3 p-2 bg-white border border-blue-200 rounded-lg text-sm outline-none"
                    >
                      <option value={0}>El mismo día</option>
                      <option value={2}>2 días antes</option>
                      <option value={7}>1 semana antes</option>
                    </select>
                  )}
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                Guardar {type === 'ingreso' ? 'Ingreso' : 'Gasto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

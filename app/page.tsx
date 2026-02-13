"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Bell, 
  Calendar, Plus, Clock, X, CheckCircle2, ArrowDownCircle, ArrowUpCircle, Loader2
} from 'lucide-react';
// Importamos la conexión desde la carpeta lib que acabas de crear
import { supabase } from '../lib/supabase'; 

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'ingreso' | 'gasto';
  category: string;
  created_at: string;
  has_alert: boolean;
  alert_days_before: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados del formulario
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ingreso' | 'gasto'>('gasto');
  const [hasAlert, setHasAlert] = useState(false);
  const [alertDays, setAlertDays] = useState(0);

  // Cargar datos al abrir la app
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTransactions(data as Transaction[]);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    try {
      const newRecord = {
        name,
        amount: parseFloat(amount),
        type,
        category: 'General',
        has_alert: type === 'gasto' ? hasAlert : false,
        alert_days_before: alertDays,
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newRecord])
        .select();

      if (error) throw error;

      if (data) {
        setTransactions([data[0] as Transaction, ...transactions]);
        setIsModalOpen(false);
        setShowSuccess(true);
        setName(''); setAmount(''); setHasAlert(false); setType('gasto');
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      alert("Error al guardar en la nube");
    }
  };

  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((acc, curr) => acc + curr.amount, 0);
  const totalGastos = transactions.filter(t => t.type === 'gasto').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIngresos - totalGastos;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce">
          <CheckCircle2 size={20} /> ¡Sincronizado con éxito!
        </div>
      )}

      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter">Moneypaz <span className="text-blue-600">Cloud</span></h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Base de datos activa</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
        >
          <Plus size={20} /> Añadir Movimiento
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p className="font-medium">Conectando con Supabase...</p>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                <p className="text-[10px] font-black text-green-600 uppercase mb-1">Ingresos</p>
                <p className="text-3xl font-black">{totalIngresos.toLocaleString('es-ES')}€</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                <p className="text-[10px] font-black text-red-600 uppercase mb-1">Gastos</p>
                <p className="text-3xl font-black">{totalGastos.toLocaleString('es-ES')}€</p>
              </div>
              <div className="sm:col-span-2 bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <p className="text-slate-400 text-sm font-medium">Balance Neto Total</p>
                <p className={`text-5xl font-black tracking-tighter ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                  {balance.toLocaleString('es-ES')}€
                </p>
                <Wallet size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50 font-bold text-gray-700 text-xs uppercase">Historial Reciente</div>
              <div className="divide-y divide-gray-50">
                {transactions.length === 0 ? (
                  <p className="p-10 text-center text-gray-400 italic text-sm">No hay registros en la nube.</p>
                ) : (
                  transactions.map(t => (
                    <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${t.type === 'ingreso' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {t.type === 'ingreso' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-black ${t.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'ingreso' ? '+' : '-'}{t.amount.toLocaleString('es-ES')}€
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Bell size={22} className="text-yellow-500 fill-yellow-500" /> Próximas Alertas
            </h2>
            <div className="space-y-4">
              {transactions.filter(t => t.has_alert).length === 0 ? (
                <p className="text-center py-6 text-xs text-gray-400">Sin alertas programadas.</p>
              ) : (
                transactions.filter(t => t.has_alert).map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                    <p className="font-bold text-gray-900 text-sm">{alert.name}</p>
                    <p className="text-[10px] text-yellow-700 uppercase font-black">Aviso {alert.alert_days_before} días antes</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Nuevo Registro</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button type="button" onClick={() => setType('gasto')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === 'gasto' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>Gasto</button>
                <button type="button" onClick={() => setType('ingreso')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === 'ingreso' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>Ingreso</button>
              </div>
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Concepto" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              <input required value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" placeholder="Importe 0.00€" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              
              {type === 'gasto' && (
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={hasAlert} onChange={e => setHasAlert(e.target.checked)} className="w-5 h-5 rounded" />
                    <span className="font-bold text-blue-800 text-sm">¿Activar alerta?</span>
                  </label>
                  {hasAlert && (
                    <select value={alertDays} onChange={e => setAlertDays(parseInt(e.target.value))} className="w-full mt-3 p-2 bg-white border border-blue-200 rounded-lg text-sm outline-none font-medium">
                      <option value={0}>Mismo día</option>
                      <option value={2}>2 días antes</option>
                      <option value={7}>1 semana antes</option>
                    </select>
                  )}
                </div>
              )}
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">Guardar en la Nube</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Bell, Plus, X, CheckCircle2, AlertCircle, 
  ArrowDownCircle, ArrowUpCircle, Loader2, TrendingUp, TrendingDown 
} from 'lucide-react';
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
  const [status, setStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ingreso' | 'gasto'>('gasto');
  const [hasAlert, setHasAlert] = useState(false);
  const [alertDays, setAlertDays] = useState(0);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      console.error("Error:", err);
      setStatus({ msg: "Error de sincronización", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    try {
      const newTransaction = {
        name: name.toUpperCase(),
        amount: parseFloat(amount),
        type,
        category: 'General',
        has_alert: type === 'gasto' ? hasAlert : false,
        alert_days_before: alertDays,
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();

      if (error) throw error;

      if (data) {
        setTransactions([data[0], ...transactions]);
        setIsModalOpen(false);
        setStatus({ msg: "¡Sincronizado en la nube!", type: 'success' });
        setName(''); setAmount(''); setHasAlert(false);
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (err: any) {
      setStatus({ msg: "Error al guardar los datos", type: 'error' });
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((acc, curr) => acc + curr.amount, 0);
  const totalGastos = transactions.filter(t => t.type === 'gasto').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIngresos - totalGastos;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {status && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-[2rem] shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-black text-xs uppercase tracking-widest">{status.msg}</span>
        </div>
      )}

      <header className="max-w-5xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic">MONEYPAZ<span className="text-blue-600">2</span></h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Cloud Active: najvbblgogakmrpmwago</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-slate-200 font-black text-xs uppercase tracking-[0.2em]"
        >
          <Plus size={18} strokeWidth={3} /> Nuevo Registro
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] opacity-20">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-black uppercase text-[10px] tracking-[0.4em]">Conectando...</p>
        </div>
      ) : (
        <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                <p className="text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-widest">Ingresos</p>
                <p className="text-3xl font-black">{totalIngresos.toLocaleString()}€</p>
                <TrendingUp className="absolute -right-2 -bottom-2 text-emerald-50 opacity-0 group-hover:opacity-100 transition-all" size={80} />
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                <p className="text-[10px] font-black text-rose-500 uppercase mb-2 tracking-widest">Gastos</p>
                <p className="text-3xl font-black">{totalGastos.toLocaleString()}€</p>
                <TrendingDown className="absolute -right-2 -bottom-2 text-rose-50 opacity-0 group-hover:opacity-100 transition-all" size={80} />
              </div>
              <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-100 flex flex-col justify-center">
                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Balance Neto</p>
                <p className="text-4xl font-black tracking-tighter">{balance.toLocaleString()}€</p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Historial Cloud</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {transactions.length === 0 ? (
                  <div className="p-24 text-center">
                    <p className="text-slate-300 italic font-bold text-sm">No hay datos en la nube.</p>
                  </div>
                ) : (
                  transactions.map(t => (
                    <div key={t.id} className="p-8 flex justify-between items-center hover:bg-slate-50/80 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${t.type === 'ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {t.type === 'ingreso' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-lg tracking-tighter italic uppercase">{t.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className={`font-black text-2xl ${t.type === 'ingreso' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'ingreso' ? '+' : '-'}{t.amount.toLocaleString()}€
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm sticky top-8">
              <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 mb-8 uppercase tracking-[0.3em]">
                <Bell size={18} className="text-amber-500 fill-amber-500" /> Alertas Programadas
              </h2>
              <div className="space-y-4">
                {transactions.filter(t => t.has_alert).length === 0 ? (
                  <div className="py-12 px-6 text-center rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-loose">No hay avisos configurados para gastos recurrentes</p>
                  </div>
                ) : (
                  transactions.filter(t => t.has_alert).map(alert => (
                    <div key={alert.id} className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 relative group overflow-hidden">
                      <p className="font-black text-slate-800 text-xs uppercase italic relative z-10">{alert.name}</p>
                      <p className="text-[9px] text-amber-600 uppercase font-black mt-1 tracking-tighter relative z-10">Antelación: {alert.alert_days_before} días</p>
                      <Bell size={40} className="absolute -right-2 -bottom-2 text-amber-200/40 rotate-12 group-hover:rotate-0 transition-transform" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-lg shadow-2xl p-10 border border-white/20">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900">Nuevo Registro</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-4 rounded-full text-slate-400 hover:text-rose-500 transition-all"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex bg-slate-100 p-2 rounded-3xl shadow-inner">
                <button type="button" onClick={() => setType('gasto')} className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black transition-all ${type === 'gasto' ? 'bg-white text-rose-600 shadow-xl' : 'text-slate-400'}`}>GASTO</button>
                <button type="button" onClick={() => setType('ingreso')} className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black transition-all ${type === 'ingreso' ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-400'}`}>INGRESO</button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Concepto</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="EJ. ALQUILER FEBRERO" className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-black uppercase text-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-

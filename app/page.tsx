"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  PlusCircle, 
  Bell, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  ChevronRight,
  TrendingUp,
  X,
  Clock,
  Check,
  ShieldCheck
} from "lucide-react";

// Definición de tipos estricta para evitar errores de compilación
interface Alert {
  id: string;
  title: string;
  date: string;
  amount: number;
  isRecurrent: boolean;
  reminderDays: number;
}

export default function App() {
  // Estado de montaje para evitar errores de hidratación (Hydration Mismatch)
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Datos iniciales de la aplicación
  const [balance] = useState(1540.50);
  const [income] = useState(2800.00);
  const [expenses] = useState(1259.50);
  
  // Estado para el formulario
  const [newEntry, setNewEntry] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    isRecurrent: false,
    reminderDays: 1
  });

  // Alertas iniciales (El Asistente Activo)
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', title: 'Alquiler Marzo', date: '2024-03-01', amount: 850, isRecurrent: true, reminderDays: 5 },
    { id: '2', title: 'Seguro Hogar', date: '2024-03-10', amount: 45.20, isRecurrent: true, reminderDays: 3 },
    { id: '3', title: 'Suscripción TV', date: '2024-03-15', amount: 12.90, isRecurrent: true, reminderDays: 1 }
  ]);

  // Efecto para marcar como montado (Crucial para Next.js)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (!newEntry.title || !newEntry.amount) return;
    
    if (newEntry.isRecurrent) {
      const newAlert: Alert = {
        id: Math.random().toString(36).substring(2, 9),
        title: newEntry.title,
        amount: parseFloat(newEntry.amount),
        date: newEntry.date,
        isRecurrent: true,
        reminderDays: newEntry.reminderDays
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsModalOpen(false);
      setNewEntry({ title: "", amount: "", date: new Date().toISOString().split('T')[0], isRecurrent: false, reminderDays: 1 });
    }, 1200);
  };

  // Si no está montado, devolvemos un fondo neutro para evitar el parpadeo
  if (!mounted) return <div className="min-h-screen bg-[#0A0C10]" />;

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100 font-sans pb-24 selection:bg-emerald-500/30">
      {/* HEADER */}
      <header className="max-w-md mx-auto p-6 flex items-center justify-between sticky top-0 bg-[#0A0C10]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Wallet className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">MONEYPAZ</h1>
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Status: Online</p>
          </div>
        </div>
        <div className="relative p-2.5 bg-[#161B22] border border-[#30363D] rounded-2xl">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0A0C10]"></span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 space-y-8 animate-in fade-in duration-700">
        {/* RESUMEN FINANCIERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-emerald-600 p-8 text-black shadow-2xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Disponible</p>
            <h2 className="text-5xl font-black mt-1 tracking-tighter">{balance.toLocaleString()}€</h2>
            
            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase mb-1">
                  <ArrowUpCircle className="w-3.5 h-3.5" /> Ingresos
                </div>
                <p className="text-xl font-black">{income.toLocaleString()}€</p>
              </div>
              <div className="bg-black/5 backdrop-blur-md p-4 rounded-3xl border border-black/5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase mb-1">
                  <ArrowDownCircle className="w-3.5 h-3.5" /> Gastos
                </div>
                <p className="text-xl font-black">{expenses.toLocaleString()}€</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        </section>

        {/* ALERTAS DEL ASISTENTE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> 
              Próximos Avisos
            </h3>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
              {alerts.length} activos
            </span>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-[#161B22]/60 border border-[#30363D] p-5 rounded-[2rem] flex items-center justify-between group hover:bg-[#1c2128] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{alert.title}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {new Date(alert.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-emerald-500">-{alert.amount}€</span>
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-4 text-center opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Moneypaz v2.0</p>
        </section>
      </main>

      {/* BOTÓN FLOTANTE */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all z-50"
      >
        <PlusCircle className="w-8 h-8" strokeWidth={2.5} />
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#161B22] w-full max-w-md rounded-[2.5rem] border border-[#30363D] overflow-hidden shadow-2xl">
            {showSuccess ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-black" strokeWidth={4} />
                </div>
                <p className="font-black text-emerald-500 uppercase">¡Guardado!</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-[#30363D] flex justify-between items-center bg-[#1c2128]">
                  <h2 className="text-lg font-black tracking-tighter text-white uppercase">Nuevo Registro</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Concepto"
                      className="w-full bg-[#0A0C10] border border-[#30363D] p-5 rounded-2xl outline-none focus:border-emerald-500 font-bold text-white"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                    />
                    <input 
                      type="number" 
                      placeholder="0.00€"
                      className="w-full bg-[#0A0C10] border border-[#30363D] p-5 rounded-2xl outline-none focus:border-emerald-500 font-black text-3xl text-emerald-500"
                      value={newEntry.amount}
                      onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-[#0A0C10] border border-[#30363D] rounded-[2rem]">
                    <div className="flex items-center gap-4">
                      <Bell className={`w-5 h-5 ${newEntry.isRecurrent ? 'text-blue-400' : 'text-gray-600'}`} />
                      <span className="text-sm font-black text-white">¿Recordatorio?</span>
                    </div>
                    <button 
                      onClick={() => setNewEntry({...newEntry, isRecurrent: !newEntry.isRecurrent})}
                      className={`w-12 h-6 rounded-full relative transition-colors ${newEntry.isRecurrent ? 'bg-emerald-500' : 'bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${newEntry.isRecurrent ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full py-6 bg-emerald-500 text-black font-black rounded-[2rem] hover:bg-emerald-400 transition-all text-lg"
                  >
                    CONFIRMAR
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

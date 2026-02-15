"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Bell, 
  Loader2, 
  LogOut,
  X,
  Calendar,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Movement {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  concept: string;
  category: string;
  created_at: string;
}

interface Alert {
  id: string;
  title: string;
  date: string;
  amount: number;
}

export default function Dashboard() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', title: 'Alquiler', date: '2024-03-01', amount: 850 },
    { id: '2', title: 'Suscripción Netflix', date: '2024-03-05', amount: 15.99 }
  ]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [newAmount, setNewAmount] = useState("");
  const [newConcept, setNewConcept] = useState("");
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
      } else {
        setUser(session.user);
        fetchMovements(session.user.id);
      }
    };
    checkUser();
  }, [supabase]);

  const fetchMovements = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('movements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovements(data || []);
    } catch (error: any) {
      console.error("Error cargando datos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovement = async () => {
    if (!user) {
      toast({ title: "Inicia sesión", description: "Debes estar registrado para guardar datos.", variant: "destructive" });
      return;
    }
    if (!newAmount || !newConcept) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('movements')
        .insert([{
          user_id: user.id,
          type: newType,
          amount: parseFloat(newAmount),
          concept: newConcept,
          category: 'General'
        }]);

      if (error) throw error;

      toast({ title: "¡Registrado!", description: "Movimiento guardado en tu nube." });
      setIsModalOpen(false);
      setNewAmount("");
      setNewConcept("");
      fetchMovements(user.id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const totals = movements.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += Number(curr.amount);
    else acc.expense += Number(curr.amount);
    return acc;
  }, { income: 0, expense: 0 });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100 font-sans pb-20">
      {/* Header Estilo Premium */}
      <header className="border-b border-white/5 bg-[#0D1117]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tighter">MONEYPAZ</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Button variant="ghost" className="text-gray-400 hover:text-white text-xs gap-2" onClick={() => supabase.auth.signOut().then(() => window.location.reload())}>
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            ) : (
              <Button onClick={() => router.push('/signup')} className="bg-emerald-500 text-black font-bold text-xs h-8">Unirse</Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Balance Card - Inspirado en el proyecto 1 */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-black shadow-2xl shadow-emerald-500/20">
          <div className="relative z-10">
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Balance Disponible</p>
            <h2 className="text-5xl md:text-6xl font-black mt-1">{(totals.income - totals.expense).toLocaleString()}€</h2>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Ingresos</span>
                </div>
                <p className="text-xl font-bold">{totals.income}€</p>
              </div>
              <div className="bg-black/10 backdrop-blur-md rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Gastos</span>
                </div>
                <p className="text-xl font-bold">{totals.expense}€</p>
              </div>
            </div>
          </div>
          {/* Decoración abstracta */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sección de Alertas Próximas (Tu pedido especial) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Alertas Próximas
              </h3>
              <span className="text-xs text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-full">Activas</span>
            </div>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-[#161B22] border border-[#30363D] p-4 rounded-2xl flex items-center justify-between hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{alert.title}</p>
                      <p className="text-xs text-gray-500">Vence el {new Date(alert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="font-bold text-sm text-blue-400">-{alert.amount}€</p>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full border-2 border-dashed border-[#30363D] text-gray-500 h-12 rounded-2xl hover:bg-transparent hover:text-blue-400 hover:border-blue-500/50 transition-all">
                + Configurar nueva alerta
              </Button>
            </div>
          </section>

          {/* Historial Reciente */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Historial Reciente</h3>
              <Button variant="link" className="text-emerald-500 text-xs p-0">Ver todo</Button>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden">
              {movements.length === 0 ? (
                <div className="p-12 text-center text-gray-500 italic text-sm">No hay movimientos registrados aún.</div>
              ) : (
                <div className="divide-y divide-[#30363D]">
                  {movements.slice(0, 5).map((m) => (
                    <div key={m.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {m.type === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{m.concept}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{new Date(m.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-black ${m.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {m.type === 'income' ? '+' : '-'}{m.amount}€
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Botón Flotante para añadir - Muy estilo App Móvil */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-500 text-black rounded-full shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        <PlusCircle className="w-8 h-8" strokeWidth={2.5} />
      </button>

      {/* Modal de Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <Card className="w-full max-w-sm bg-[#161B22] border-[#30363D] text-white overflow-hidden rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#30363D] bg-[#1C2128]">
              <CardTitle className="text-lg">Nuevo Movimiento</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex p-1 bg-black rounded-2xl">
                <button 
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${newType === 'expense' ? 'bg-red-500 text-white' : 'text-gray-500'}`}
                  onClick={() => setNewType('expense')}
                >GASTO</button>
                <button 
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${newType === 'income' ? 'bg-emerald-500 text-black' : 'text-gray-500'}`}
                  onClick={() => setNewType('income')}
                >INGRESO</button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">¿En qué concepto?</label>
                  <Input 
                    placeholder="Ej. Compra semanal" 
                    className="bg-black/40 border-[#30363D] h-12 rounded-xl focus:ring-emerald-500"
                    value={newConcept}
                    onChange={(e) => setNewConcept(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Importe (€)</label>
                  <Input 
                    type="number"
                    placeholder="0.00" 
                    className="bg-black/40 border-[#30363D] h-14 rounded-xl text-2xl font-black text-center focus:ring-emerald-500"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className={`w-full h-14 rounded-2xl font-black text-lg transition-all ${newType === 'income' ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-red-500 text-white hover:bg-red-400'}`}
                onClick={handleAddMovement}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" /> : 'CONFIRMAR'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import { Check, Loader2, UserX, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ManagerApproval = () => {
    const [pendingManagers, setPendingManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchPendingManagers();
    }, []);

    const fetchPendingManagers = async () => {
        try {
            const response = await api.get('/admin/pending-managers');
            setPendingManagers(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load pending managers');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            await api.post(`/admin/approve-manager/${id}`);
            toast.success('Manager approved successfully');
            setPendingManagers(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            toast.error('Failed to approve manager');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject and delete this application?')) return;
        
        setProcessingId(id);
        try {
            await api.delete(`/admin/reject-manager/${id}`);
            toast.success('Manager application rejected');
            setPendingManagers(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            toast.error('Failed to reject manager');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Users className="text-blue-500" />
                    Manager Approvals
                </h1>
                <p className="text-slate-400 mt-2">Review and approve new manager accounts</p>
            </div>

            {pendingManagers.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center">
                    <div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Check className="text-slate-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white">All caught up!</h3>
                    <p className="text-slate-500 mt-2">There are no pending manager applications at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingManagers.map((manager) => (
                        <div key={manager.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[60px] rounded-full"></div>
                            
                            <div className="flex items-start justify-between mb-4">
                                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-blue-500">
                                    <Users size={24} />
                                </div>
                                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full uppercase tracking-wider border border-amber-500/20">
                                    Pending Review
                                </span>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-xl font-bold text-white truncate">{manager.name}</h3>
                                <p className="text-slate-400 text-sm truncate">{manager.email}</p>
                                <p className="text-slate-500 text-xs font-medium">{manager.phone}</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleApprove(manager.id)}
                                    disabled={processingId === manager.id}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20"
                                >
                                    {processingId === manager.id ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>
                                            <Check size={18} />
                                            Approve
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleReject(manager.id)}
                                    disabled={processingId === manager.id}
                                    className="px-3 py-3 bg-slate-800 hover:bg-rose-900/30 hover:text-rose-500 hover:border-rose-500/50 text-slate-400 border border-slate-700 rounded-xl transition-all disabled:opacity-50"
                                >
                                    <UserX size={18} />
                                </button>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Applied on</span>
                                <span className="text-[10px] text-slate-300 font-bold">{new Date(manager.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManagerApproval;

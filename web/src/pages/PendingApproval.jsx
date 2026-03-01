import { Clock, LogOut, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PendingApproval = () => {
    const { logout, user, refreshUser } = useAuth();
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();

    const checkStatus = async () => {
        setChecking(true);
        try {
            const updatedUser = await refreshUser();
            if (updatedUser?.isApproved) {
                navigate('/');
            }
        } finally {
            setChecking(false);
        }
    };

    // Check status every 10 seconds while on this page
    useEffect(() => {
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-500/50 animate-pulse"></div>
                
                <div className="mb-8 flex justify-center">
                    <div className="bg-amber-500/10 p-6 rounded-full border border-amber-500/20">
                        <Clock size={64} className="text-amber-500 animate-[spin_10s_linear_infinite]" />
                    </div>
                </div>

                <h1 className="text-4xl font-black mb-4">Approval Pending</h1>
                <p className="text-slate-400 text-lg mb-8">
                    Hello <span className="text-white font-bold">{user?.name}</span>, your account has been created successfully. 
                    However, it is currently <span className="text-amber-400 font-semibold underline underline-offset-4 decoration-amber-400/30">waiting for admin approval</span>.
                </p>

                <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 text-left border border-slate-700">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Next Steps:</h3>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex gap-2">
                            <span className="text-amber-500">•</span>
                            Our administrator will review your account soon.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-amber-500">•</span>
                            You will be able to access the dashboard once approved.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-amber-500">•</span>
                            Try logging in again in 24-48 hours.
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={checkStatus}
                        disabled={checking}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        <RefreshCcw size={20} className={checking ? 'animate-spin' : ''} />
                        {checking ? 'Checking Authority...' : 'Check Status Now'}
                    </button>

                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all border border-slate-700 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;

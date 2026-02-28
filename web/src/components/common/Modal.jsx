import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-xl" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className={`bg-slate-900 border border-slate-800 w-full ${maxWidth} rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all z-10"
        >
          <X size={20} />
        </button>

        {(title || subtitle) && (
          <div className="p-8 pb-0">
            {title && <h3 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">{subtitle}</p>}
          </div>
        )}
        
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

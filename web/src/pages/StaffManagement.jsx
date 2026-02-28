import { Edit2, Filter, MoreVertical, Plus, Search, Shield, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'DRIVER', password: '', vehicleNumber: '', licenseNumber: '' });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff');
      setStaff(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingStaff(item);
      setFormData({ name: item.name, email: item.email || '', phone: item.phone, role: item.role, password: '' });
    } else {
      setEditingStaff(null);
      setFormData({ name: '', email: '', phone: '', role: 'DRIVER', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        // await api.put(`/staff/${editingStaff.id}`, formData);
        toast.success('Staff details updated');
      } else {
        // await api.post('/staff', formData);
        toast.success('New staff member added');
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      toast.error('Failed to save staff');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Staff Management</h2>
          <p className="text-slate-400 mt-1">Manage delivery drivers and system managers</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Staff</span>
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full bg-slate-800 border-none rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors">
              <Filter size={18} />
              <span className="text-sm font-semibold">Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-5">Name & Role</th>
                <th className="px-6 py-5">Phone</th>
                <th className="px-6 py-5">Status Today</th>
                <th className="px-6 py-5 text-center">Deliveries</th>
                <th className="px-6 py-5 text-right">Cash Today</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700 font-bold group-hover:border-blue-500 transition-colors">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{member.name}</p>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded leading-none flex items-center gap-1 w-fit mt-1 ${
                          member.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400' : member.role === 'MANAGER' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700/50 text-slate-300'
                        }`}>
                          <Shield size={10} />
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-300 font-medium">{member.phone}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      member.status === 'On Field' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        member.status === 'On Field' ? 'bg-blue-400' : 
                        member.status === 'Active' ? 'bg-emerald-400' : 
                        'bg-slate-500'
                      }`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-white font-bold">{member.deliveries}</span>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-white">₹{member.collection}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={() => handleOpenModal(member)} className="p-2 text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-all" title="Deactivate">
                        <UserX size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">{editingStaff ? 'Edit Staff Details' : 'Register New Staff'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">Esc</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="10-digit mobile"
                    className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Email (Optional)</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                  className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Assign Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                  >
                    <option value="DRIVER">Delivery Staff (Driver)</option>
                    <option value="MANAGER">Operations Manager</option>
                  </select>
                </div>
                {!editingStaff && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Temp Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  {editingStaff ? 'Update Staff' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;

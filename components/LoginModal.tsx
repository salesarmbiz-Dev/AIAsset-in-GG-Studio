import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, LogIn, UserPlus } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        if (isSignUp) {
            setError("สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน");
        } else {
            onSuccess();
            onClose();
        }
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#012840]/90 backdrop-blur-md anim-fadeSlideUp">
      <div className="w-full max-w-md bg-[#011627] border border-[#05F2F2]/30 rounded-2xl p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6593A6] hover:text-white p-2"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h2>
          <p className="text-[#6593A6]">เพื่อบันทึก Prompt และใช้งาน Library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#6593A6] text-sm mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#012840] border border-[#05F2F2]/30 rounded-xl p-4 text-white focus:border-[#F27405] focus:outline-none min-h-[52px]"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[#6593A6] text-sm mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#012840] border border-[#05F2F2]/30 rounded-xl p-4 text-white focus:border-[#F27405] focus:outline-none min-h-[52px]"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className={`p-3 rounded-xl text-sm ${error.includes('สำเร็จ') ? 'bg-[#58CC02]/20 text-[#58CC02]' : 'bg-[#FF4B4B]/20 text-[#FF4B4B]'}`}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#F27405] to-[#F97316] text-white font-bold rounded-xl py-4 min-h-[56px] shadow-[0_6px_20px_rgba(242,116,5,0.3)] hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'กำลังโหลด...' : (isSignUp ? <><UserPlus size={20}/> สมัครสมาชิก</> : <><LogIn size={20}/> เข้าสู่ระบบ</>)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-[#05F2F2] hover:underline text-sm"
          >
            {isSignUp ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิกใหม่'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

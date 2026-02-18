import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Award, Shield, Crown, Lock, CheckCircle, Share2, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCertifications, getUserProgress, SEED_CERTS } from '../lib/certificationService';
import * as Icons from 'lucide-react';

const Certifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
      getCertifications().then(setCerts);
      if (user) getUserProgress(user.id).then(setProgress);
  }, [user]);

  const IconComponent = ({ name, color, size = 24 }: { name: string, color: string, size?: number }) => {
      const LucideIcon = (Icons as any)[name];
      return LucideIcon ? <LucideIcon size={size} style={{ color }} /> : <Award size={size} style={{ color }} />;
  };

  return (
    <div className="min-h-screen bg-[#012840] pb-24">
      <header className="p-4 flex items-center gap-2 sticky top-0 bg-[#012840]/90 backdrop-blur z-50 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="text-[#FFD700]"/> Certifications
        </h1>
      </header>

      <div className="p-4 space-y-6 max-w-xl mx-auto">
          <div className="text-center mb-6">
              <h2 className="text-white text-lg font-bold">Level Up Your AI Skills</h2>
              <p className="text-[#6593A6] text-sm">ทำภารกิจให้ครบเพื่อรับ Certificate รับรองความสามารถ</p>
          </div>

          {certs.map((cert) => {
              const userProg = progress.find(p => p.certification_id === cert.id);
              const isCompleted = !!userProg?.completed_at;
              const isLocked = cert.level > 1 && !progress.find(p => p.certification_id === SEED_CERTS[cert.level - 2].id)?.completed_at;

              // Calculate overall percentage
              let totalReq = 0;
              let currentVal = 0;
              Object.entries(cert.requirements).forEach(([key, req]: any) => {
                  totalReq += 100;
                  const val = userProg?.progress[key] || 0;
                  currentVal += Math.min(100, (val / req.target) * 100);
              });
              const percent = Math.round(currentVal / totalReq * 100) || 0;

              return (
                  <div key={cert.id} className={`rounded-2xl p-6 border transition-all ${isCompleted ? 'bg-[#011627] border-[#58CC02]/50 shadow-[0_0_20px_rgba(88,204,2,0.1)]' : isLocked ? 'bg-[#011627]/50 border-white/5 opacity-70' : 'bg-[#011627] border-white/10'}`}>
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl bg-[#012840] flex items-center justify-center border border-white/5 ${isCompleted ? 'shadow-lg' : ''}`}>
                                  <IconComponent name={cert.badge_icon} color={isLocked ? '#6593A6' : cert.badge_color} size={28} />
                              </div>
                              <div>
                                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                      {cert.name}
                                      {isLocked && <Lock size={14} className="text-[#6593A6]" />}
                                  </h3>
                                  <p className="text-[#6593A6] text-xs">Level {cert.level}</p>
                              </div>
                          </div>
                          {isCompleted ? (
                              <span className="bg-[#58CC02]/20 text-[#58CC02] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                  <CheckCircle size={14} /> Completed
                              </span>
                          ) : (
                              <span className="text-white font-bold text-xl">{percent}%</span>
                          )}
                      </div>

                      {/* Requirements */}
                      <div className="space-y-3 mb-4">
                          {Object.entries(cert.requirements).map(([key, req]: any) => {
                              const current = userProg?.progress[key] || 0;
                              const target = req.target;
                              const reqPercent = Math.min(100, (current / target) * 100);
                              
                              return (
                                  <div key={key}>
                                      <div className="flex justify-between text-xs text-[#6593A6] mb-1">
                                          <span>{req.label}</span>
                                          <span className={current >= target ? 'text-[#58CC02]' : ''}>{current}/{target}</span>
                                      </div>
                                      <div className="w-full h-2 bg-[#012840] rounded-full overflow-hidden">
                                          <div 
                                            className="h-full transition-all duration-500" 
                                            style={{ 
                                                width: `${reqPercent}%`, 
                                                backgroundColor: current >= target ? '#58CC02' : cert.badge_color 
                                            }} 
                                          />
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      {isCompleted && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                              <button className="flex-1 py-2 bg-[#F27405] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                                  <Download size={16} /> Certificate
                              </button>
                              <button className="flex-1 py-2 bg-[#012840] border border-[#05F2F2] text-[#05F2F2] rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                                  <Share2 size={16} /> Share
                              </button>
                          </div>
                      )}
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default Certifications;

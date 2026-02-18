import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserPerformanceStats } from '../lib/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft, BarChart3, TrendingUp, Clock, DollarSign, CheckCircle } from 'lucide-react';

const UserPerformance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
        getUserPerformanceStats(user.id).then(setStats);
    }
  }, [user]);

  if (!stats) return <div className="min-h-screen bg-[#012840] p-8 text-white">Loading Stats...</div>;

  return (
    <div className="min-h-screen bg-[#012840] pb-20">
      <header className="p-4 flex items-center gap-2 sticky top-0 bg-[#012840]/90 backdrop-blur z-50 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-[#05F2F2]"/> Performance
        </h1>
      </header>

      <div className="p-4 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#011627] p-4 rounded-xl border border-[#05F2F2]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><CheckCircle size={60} className="text-[#05F2F2]"/></div>
                  <p className="text-[#6593A6] text-xs">Outputs สร้างแล้ว</p>
                  <h3 className="text-2xl font-bold text-white">{stats.totalOutputs}</h3>
                  <div className="text-[#05F2F2] text-xs font-bold mt-1">Success {stats.usedAsIsRate}%</div>
              </div>
              <div className="bg-[#011627] p-4 rounded-xl border border-[#F27405]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><Clock size={60} className="text-[#F27405]"/></div>
                  <p className="text-[#6593A6] text-xs">เวลาที่ประหยัดไป</p>
                  <h3 className="text-2xl font-bold text-white">{stats.timeSavedHours} ชม.</h3>
                  <div className="text-[#F27405] text-xs font-bold mt-1">~5 วันทำงาน</div>
              </div>
              <div className="bg-[#011627] p-4 rounded-xl border border-[#FFD700]/30 relative overflow-hidden col-span-2">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><DollarSign size={80} className="text-[#FFD700]"/></div>
                  <p className="text-[#6593A6] text-xs">Revenue Generated (Est.)</p>
                  <h3 className="text-3xl font-bold text-[#FFD700]">฿{stats.totalRevenue.toLocaleString()}</h3>
                  <div className="text-white/60 text-xs mt-1">ประเมินจาก Feedback ที่คุณกรอก</div>
              </div>
          </div>

          {/* Chart */}
          <div className="bg-[#011627] p-4 rounded-xl border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> Usage Trends</h3>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.performanceOverTime}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                          <XAxis dataKey="name" stroke="#6593A6" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#012840', border: '1px solid #05F2F2'}} 
                            itemStyle={{color: '#fff'}}
                          />
                          <Line type="monotone" dataKey="used_as_is" stroke="#58CC02" strokeWidth={3} dot={{r: 4}} name="Used As Is" />
                          <Line type="monotone" dataKey="edited" stroke="#05F2F2" strokeWidth={2} dot={{r: 4}} name="Edited" />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Top Performing */}
          <div>
              <h3 className="text-white font-bold mb-4">Top Performing Outputs</h3>
              <div className="space-y-3">
                  {stats.topPerforming.map((item: any, i: number) => (
                      <div key={i} className="bg-[#011627] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                          <div>
                              <div className="text-white font-bold">{item.title}</div>
                              <div className="text-xs text-[#6593A6] uppercase">{item.type}</div>
                          </div>
                          <div className="bg-[#FFD700]/10 text-[#FFD700] px-3 py-1 rounded-lg font-bold text-sm border border-[#FFD700]/30">
                              {item.metric}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

      </div>
    </div>
  );
};

export default UserPerformance;

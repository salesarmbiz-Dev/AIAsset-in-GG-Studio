import { supabase } from './supabase';
import { UsageStatus } from '../types';

export const submitFeedback = async (
  usageId: string,
  usageType: 'asset' | 'fine_tune',
  userId: string,
  status: UsageStatus,
  metrics?: Record<string, number>
) => {
  return await supabase.from('output_feedback').insert([{
    usage_id: usageId,
    usage_type: usageType,
    user_id: userId,
    usage_status: status,
    performance_metrics: metrics
  }]);
};

// Mock Aggregation for User Performance Dashboard
export const getUserPerformanceStats = async (userId: string) => {
  // In a real app, this would be a complex query or RPC
  // For demo, we simulate aggregated data
  
  // Simulated Chart Data (Last 4 weeks)
  const performanceOverTime = [
    { name: 'Week 1', used_as_is: 12, edited: 5, unused: 2 },
    { name: 'Week 2', used_as_is: 18, edited: 8, unused: 3 },
    { name: 'Week 3', used_as_is: 25, edited: 4, unused: 1 },
    { name: 'Week 4', used_as_is: 30, edited: 6, unused: 2 },
  ];

  const totalOutputs = 116;
  const usedAsIsRate = 68; // %
  const totalRevenue = 154000;
  const timeSavedHours = 42;

  const topPerforming = [
    { title: 'Marketing Campaign: ร้านกาแฟ', metric: 'Reach 12k', type: 'asset' },
    { title: 'Pro Sales Copy: ครีมกันแดด', metric: 'ROI 5.2x', type: 'fine_tune' },
    { title: 'LINE OA: โปรโมชั่นสิ้นเดือน', metric: 'Open Rate 45%', type: 'asset' },
  ];

  return {
    performanceOverTime,
    totalOutputs,
    usedAsIsRate,
    totalRevenue,
    timeSavedHours,
    topPerforming
  };
};

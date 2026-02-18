import { supabase } from './supabase';
import { Certification, UserCertification } from '../types';

export const SEED_CERTS: Certification[] = [
    {
        id: 'cert-1',
        name: 'AI Starter',
        level: 1,
        description: 'เริ่มต้นใช้งาน AI Asset Library ขั้นพื้นฐาน',
        badge_icon: 'Award',
        badge_color: '#05F2F2',
        requirements: {
            assets_used: { target: 5, label: 'ใช้ Asset ครบ 5 ตัว' },
            generates: { target: 10, label: 'Generate 10 ครั้ง' },
            saves: { target: 3, label: 'Save Prompt 3 ครั้ง' }
        }
    },
    {
        id: 'cert-2',
        name: 'AI Practitioner',
        level: 2,
        description: 'ใช้งาน AI เพื่อเพิ่มประสิทธิภาพการทำงานจริง',
        badge_icon: 'Shield',
        badge_color: '#F27405',
        requirements: {
            assets_used: { target: 15, label: 'ใช้ Asset ครบ 15 ตัว' },
            remixes: { target: 5, label: 'ใช้ Remix 5 ครั้ง' },
            avg_rating: { target: 4, label: 'ให้ Rating ครบ 4 ครั้ง' }
        }
    },
    {
        id: 'cert-3',
        name: 'AI Strategist',
        level: 3,
        description: 'ผู้เชี่ยวชาญการใช้ AI ระดับองค์กรและทีม',
        badge_icon: 'Crown',
        badge_color: '#FFD700',
        requirements: {
            assets_used: { target: 30, label: 'ใช้ Asset ครบ 30 ตัว' },
            team_contributions: { target: 10, label: 'Share to Team 10 ครั้ง' },
            workshop_completed: { target: 1, label: 'เข้า Workshop 1 ครั้ง' }
        }
    }
];

export const getCertifications = async () => SEED_CERTS;

export const getUserProgress = async (userId: string): Promise<UserCertification[]> => {
    // In real app, calculate progress from analytics_events
    // Here we simulate progress
    
    // Simulate finding existing record or mock one
    return SEED_CERTS.map(cert => {
        const isCompleted = cert.level === 1; // Mock level 1 completed
        return {
            id: `uc-${cert.id}`,
            certification_id: cert.id,
            progress: {
                assets_used: isCompleted ? cert.requirements.assets_used.target : 3,
                generates: isCompleted ? cert.requirements.generates?.target || 0 : 5,
                saves: 2,
                remixes: 1,
                team_contributions: 0,
                workshop_completed: 0
            },
            completed_at: isCompleted ? new Date().toISOString() : undefined,
            verify_code: isCompleted ? 'AIM-8X92' : undefined
        } as any;
    });
};

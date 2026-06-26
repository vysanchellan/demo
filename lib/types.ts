export interface ToxicityReport {
  id: string
  created_at: string
  company_name: string
  industry: string
  company_size: string
  city: string
  country: string
  report_type: string
  severity: number
  description: string
  is_anonymous: boolean
  user_id?: string
  status: 'pending' | 'reviewed' | 'verified'
  upvotes: number
}

export interface Company {
  id: string
  name: string
  industry: string
  city: string
  country: string
  toxicity_score: number
  report_count: number
  verified: boolean
  created_at: string
}

export interface BurnoutAssessment {
  id: string
  user_id: string
  created_at: string
  score: number
  level: 'healthy' | 'caution' | 'warning' | 'critical'
  exhaustion_score: number
  cynicism_score: number
  efficacy_score: number
  answers: Record<string, number>
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'hotline' | 'app' | 'article' | 'therapy' | 'community'
  url?: string
  phone?: string
  free: boolean
  country?: string
}

export interface UserProfile {
  id: string
  email: string
  display_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  burnout_streak: number
}

export type ReportType =
  | 'harassment'
  | 'overwork'
  | 'gaslighting'
  | 'discrimination'
  | 'wage_theft'
  | 'nepotism'
  | 'retaliation'
  | 'unsafe_conditions'
  | 'micromanagement'
  | 'other'

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  harassment: 'Harassment / Bullying',
  overwork: 'Chronic Overwork',
  gaslighting: 'Gaslighting / Manipulation',
  discrimination: 'Discrimination',
  wage_theft: 'Wage Theft / Unpaid OT',
  nepotism: 'Nepotism / Favoritism',
  retaliation: 'Retaliation',
  unsafe_conditions: 'Unsafe Conditions',
  micromanagement: 'Micromanagement',
  other: 'Other',
}

export const INDUSTRIES = [
  'Technology', 'Finance / Banking', 'Healthcare', 'Education',
  'Retail', 'Manufacturing', 'Government', 'Media / Entertainment',
  'Legal', 'Hospitality', 'Construction', 'Agriculture', 'Other',
]

export const BURNOUT_LEVELS = {
  healthy: { label: 'Healthy', color: '#4ECDC4', range: [0, 25] },
  caution: { label: 'Caution', color: '#FFB347', range: [26, 50] },
  warning: { label: 'Warning', color: '#FF6B6B', range: [51, 75] },
  critical: { label: 'Critical', color: '#FF3B30', range: [76, 100] },
} as const

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = "MMM d, yyyy") {
  return format(new Date(date), fmt)
}

export function formatRelative(date: string | Date) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return format(d, "MMM d, yyyy")
}

export function getBurnoutColor(score: number) {
  if (score <= 25) return "#4ECDC4"
  if (score <= 50) return "#FFB347"
  if (score <= 75) return "#FF6B6B"
  return "#FF3B30"
}

export function getBurnoutLevel(score: number) {
  if (score <= 25) return "Healthy"
  if (score <= 50) return "Caution"
  if (score <= 75) return "Warning"
  return "Critical"
}

export function getToxicityLabel(score: number) {
  if (score <= 20) return "Safe"
  if (score <= 40) return "Low Risk"
  if (score <= 60) return "Moderate"
  if (score <= 80) return "High Risk"
  return "Toxic"
}


export function calcDaysDiff(targetDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(targetDate)
  if (isNaN(target.getTime())) return 0
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function getDaysText(days: number): { number: string; label: string } {
  return { number: String(Math.abs(days)), label: '天' }
}

export function isFutureEvent(targetDate: string): boolean {
  return calcDaysDiff(targetDate) > 0
}

export function isPastEvent(targetDate: string): boolean {
  return calcDaysDiff(targetDate) < 0
}

export function isToday(targetDate: string): boolean {
  return calcDaysDiff(targetDate) === 0
}

export interface CountdownEvent {
  id: string
  name: string
  targetDate: string
  themeColor: ThemeColor
  createdAt: string
  order: number
}

export type ThemeColor =
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'rose'
  | 'sky'
  | 'night'
  | 'peach'
  | 'mint'

export type ViewMode = 'future' | 'past'

export interface ThemeDef {
  gradient: string
  glassBg: string
  glassBorder: string
  label: string
  icon: string
}

export const THEME_GRADIENTS: Record<ThemeColor, ThemeDef> = {
  sunset: {
    gradient: 'linear-gradient(135deg, #ff6b6b, #feca57)',
    glassBg: 'rgba(255, 107, 107, 0.12)',
    glassBorder: 'rgba(255, 107, 107, 0.35)',
    label: '日落',
    icon: '🌅',
  },
  ocean: {
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    glassBg: 'rgba(102, 126, 234, 0.12)',
    glassBorder: 'rgba(102, 126, 234, 0.35)',
    label: '海洋',
    icon: '🌊',
  },
  forest: {
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    glassBg: 'rgba(17, 153, 142, 0.12)',
    glassBorder: 'rgba(17, 153, 142, 0.35)',
    label: '森林',
    icon: '🌿',
  },
  rose: {
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    glassBg: 'rgba(240, 147, 251, 0.12)',
    glassBorder: 'rgba(240, 147, 251, 0.35)',
    label: '玫瑰',
    icon: '🌹',
  },
  sky: {
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    glassBg: 'rgba(79, 172, 254, 0.12)',
    glassBorder: 'rgba(79, 172, 254, 0.35)',
    label: '天空',
    icon: '☁️',
  },
  night: {
    gradient: 'linear-gradient(135deg, #0c3483, #a2b6df)',
    glassBg: 'rgba(12, 52, 131, 0.12)',
    glassBorder: 'rgba(12, 52, 131, 0.35)',
    label: '夜幕',
    icon: '🌙',
  },
  peach: {
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    glassBg: 'rgba(250, 112, 154, 0.12)',
    glassBorder: 'rgba(250, 112, 154, 0.35)',
    label: '蜜桃',
    icon: '🍑',
  },
  mint: {
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    glassBg: 'rgba(67, 233, 123, 0.12)',
    glassBorder: 'rgba(67, 233, 123, 0.35)',
    label: '薄荷',
    icon: '🍃',
  },
}

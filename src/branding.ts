const branding = {
  name: 'Legion Alpha',
  logoUrl: '',
  faviconUrl: '/favicon.svg',
  colors: {
    background: '#09090b',
    surface: '#18181b',
    surfaceMuted: '#27272a',
    border: '#3f3f46',
    borderMuted: '#52525b',
    textMuted: '#71717a',
    textSecondary: '#a1a1aa',
    text: '#d4d4d8',
    textPrimary: '#e4e4e7',
    textStrong: '#f4f4f5',
    textBright: '#fafafa',
    textDark: '#09090b',
    primary: '#f4f4f5',
    primaryHover: '#d4d4d8',
    primaryLight: '#e4e4e7',
    primaryBorder: '#52525b',
    primarySubtle: '#27272a',
    danger: '#f87171',
    success: '#34d399',
    successStrong: '#10b981',
    successLight: '#6ee7b7',
    warning: '#fbbf24',
    warningStrong: '#f59e0b',
    accent: '#d946ef',
    accentLight: '#e879f9',
    info: '#0ea5e9',
    infoLight: '#38bdf8',
  },
} as const

export function applyBranding(): void {
  document.title = branding.name

  for (const [name, value] of Object.entries(branding.colors)) {
    const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    document.documentElement.style.setProperty(`--brand-${cssName}`, value)
  }

  const favicon = document.querySelector<HTMLLinkElement>('[data-brand-favicon]')
  if (!favicon) {
    throw new Error('The document is missing its configurable favicon link.')
  }
  favicon.href = branding.faviconUrl
}

export { branding }

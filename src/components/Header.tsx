import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { useTooltip } from '../hooks/useTooltip'
import { dismissAllTooltips } from '../lib/tooltipDismiss'
import { getActiveApiProfile } from '../lib/apiProfiles'
import ViewportTooltip from './ViewportTooltip'
import HelpModal from './HelpModal'
import { HelpCircleIcon, SettingsIcon } from './icons'

const CONSOLE_URL = 'https://api.pianyitu.com/login'
const DOCS_URL = '/docs'

export default function Header() {
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const setShowSettings = useStore((s) => s.setShowSettings)
  const [showHelp, setShowHelp] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')

  const activeProfile = getActiveApiProfile(settings)
  const [localApiKey, setLocalApiKey] = useState(activeProfile.apiKey)

  useEffect(() => {
    setLocalApiKey(activeProfile.apiKey)
  }, [activeProfile.apiKey])

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY < 20) {
            setScrollDirection('up')
          } else if (currentScrollY > lastScrollY + 10) {
            setScrollDirection('down')
          } else if (currentScrollY < lastScrollY - 10) {
            setScrollDirection('up')
          }
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const helpTooltip = useTooltip()
  const settingsTooltip = useTooltip()
  const consoleTooltip = useTooltip()
  const docsTooltip = useTooltip()

  const handleApiKeyChange = (value: string) => {
    setLocalApiKey(value)
    setSettings({ apiKey: value })
  }

  return (
    <>
      <header data-no-drag-select className="safe-area-top fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-white/[0.08] transition-transform duration-300 ease-in-out translate-y-0">
        <div className="safe-area-x safe-header-inner max-w-7xl mx-auto flex items-center justify-between relative">
          <div className="flex-1 min-w-0 pr-2 flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <img src="./pwa-icon.png" alt="便宜图" className="w-7 h-7 rounded-md" />
              <h1 className="text-[17px] sm:text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">
                便宜图
              </h1>
            </div>
            <span className="hidden sm:inline-block text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-md font-mono shrink-0">
              {activeProfile.model || 'gpt-image-2'}
            </span>
            <div className="hidden sm:flex items-center flex-1 max-w-[240px]">
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="API Key"
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div
              className="relative"
              {...consoleTooltip.handlers}
            >
              <a
                href={CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => dismissAllTooltips()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors inline-flex items-center"
                aria-label="控制台"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
              <ViewportTooltip visible={consoleTooltip.visible} className="whitespace-nowrap">
                控制台
              </ViewportTooltip>
            </div>
            <div
              className="relative"
              {...docsTooltip.handlers}
            >
              <Link
                to={DOCS_URL}
                onClick={() => dismissAllTooltips()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors inline-flex items-center"
                aria-label="API 文档"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </Link>
              <ViewportTooltip visible={docsTooltip.visible} className="whitespace-nowrap">
                API 文档
              </ViewportTooltip>
            </div>
            <div
              className="relative"
              {...helpTooltip.handlers}
            >
              <button
                onClick={() => {
                  dismissAllTooltips()
                  setShowHelp(true)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="操作指南"
              >
                <HelpCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <ViewportTooltip visible={helpTooltip.visible} className="whitespace-nowrap">
                操作指南
              </ViewportTooltip>
            </div>
            <div
              className="relative"
              {...settingsTooltip.handlers}
            >
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="设置"
              >
                <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <ViewportTooltip visible={settingsTooltip.visible} className="whitespace-nowrap">
                设置
              </ViewportTooltip>
            </div>
          </div>
        </div>
      </header>

      <div className="safe-area-top invisible pointer-events-none" aria-hidden="true">
        <div className="safe-header-inner" />
      </div>
      {showHelp && <HelpModal appMode="gallery" onClose={() => setShowHelp(false)} />}
    </>
  )
}

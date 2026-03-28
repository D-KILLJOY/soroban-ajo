'use client'

/**
 * AppLayout
 *
 * Root layout shell. On desktop (lg+) renders the FloatingSidebar and
 * offsets the main content area. On mobile renders MobileNav (FAB +
 * slide-up drawer + bottom quick-nav bar).
 *
 * Skip links are preserved for keyboard / screen-reader users.
 */

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FloatingSidebar } from './FloatingSidebar'
import { MobileNav } from './MobileNav'
import { NotificationHistory } from './NotificationHistory'
import Onboarding from './Onboarding'
import TourGuide from './TourGuide'
import { useOnboarding } from '@/hooks/useOnboarding'

interface AppLayoutProps {
  children: React.ReactNode
}

/** Shared nav item definitions */
const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    dataTour: 'dashboard',
  },
  {
    href: '/groups',
    label: 'Groups',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    dataTour: 'groups-list',
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    dataTour: 'profile',
  },
  {
    href: '/help',
    label: 'Help',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const { hasCompletedOnboarding, startOnboarding } = useOnboarding()

  useEffect(() => {
    if (!hasCompletedOnboarding && pathname === '/') {
      const timer = setTimeout(startOnboarding, 1000)
      return () => clearTimeout(timer)
    }
  }, [hasCompletedOnboarding, pathname, startOnboarding])

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      {/* ── Skip links ─────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <a
        href="#floating-sidebar"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-48 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to navigation
      </a>

      {/* ── Desktop floating sidebar ────────────────────────────────── */}
      <FloatingSidebar navItems={NAV_ITEMS} />

      {/* ── Mobile navigation ──────────────────────────────────────── */}
      <MobileNav navItems={NAV_ITEMS} />

      {/* ── Page wrapper ───────────────────────────────────────────── */}
      {/*
        On desktop: left margin = sidebar width (256px / w-64) + gap (16px left + 16px right = 32px) + 16px extra = 288px
        On mobile: bottom padding for the quick-nav bar (~64px)
      */}
      <div className="lg:ml-[288px] flex flex-col min-h-screen">
        {/* Slim top bar on desktop (notifications only — wallet lives in sidebar) */}
        <div className="hidden lg:flex items-center justify-end gap-3 px-6 pt-5 pb-2">
          <NotificationHistory />
        </div>

        {/* Main content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8 outline-none"
        >
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-surface-200 dark:border-surface-800 bg-white/60 dark:bg-surface-900/60 supports-[backdrop-filter]:backdrop-blur-sm mt-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-3">Ajo</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm">
                  Decentralized savings groups powered by Stellar blockchain.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-3">Resources</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: '/docs', label: 'Documentation' },
                    { href: '/community', label: 'Community' },
                    { href: 'https://stellar.org', label: 'Stellar Network', external: true },
                  ].map(({ href, label, external }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-3">Connect</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: 'https://github.com', label: 'GitHub' },
                    { href: 'https://twitter.com', label: 'Twitter' },
                    { href: 'https://discord.com', label: 'Discord' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-400 dark:text-surface-500">
              <p>&copy; {new Date().getFullYear()} Ajo. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Onboarding & Tour overlays */}
      <Onboarding />
      <TourGuide />
    </div>
  )
}

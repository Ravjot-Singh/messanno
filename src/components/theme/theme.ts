"use client"

import { useCallback, useSyncExternalStore } from "react"

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

import { DARK_MEDIA_QUERY as MEDIA, THEME_STORAGE_KEY as STORAGE_KEY } from "./script"

const storeListeners = new Set<() => void>()

function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === "light" || value === "dark" ? value : "system"
  } catch {
    return "system"
  }
}

function systemPrefersDark() {
  return window.matchMedia(MEDIA).matches
}

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && systemPrefersDark())
  document.documentElement.classList.toggle("dark", dark)
}

function subscribeResolved(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })

  const media = window.matchMedia(MEDIA)
  const onMediaChange = () => {
    if (readStoredTheme() === "system") applyTheme("system")
  }
  media.addEventListener("change", onMediaChange)

  return () => {
    observer.disconnect()
    media.removeEventListener("change", onMediaChange)
  }
}

function getResolvedSnapshot(): ResolvedTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function subscribeStored(callback: () => void) {
  storeListeners.add(callback)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      applyTheme(readStoredTheme())
      callback()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    storeListeners.delete(callback)
    window.removeEventListener("storage", onStorage)
  }
}

export function useTheme() {
  const resolvedTheme = useSyncExternalStore<ResolvedTheme | undefined>(
    subscribeResolved,
    getResolvedSnapshot,
    () => undefined
  )
  const theme = useSyncExternalStore<Theme>(
    subscribeStored,
    readStoredTheme,
    () => "system"
  )

  const setTheme = useCallback((next: Theme) => {
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      
    }
    applyTheme(next)
    storeListeners.forEach((listener) => listener())
  }, [])

  return { theme, resolvedTheme, setTheme }
}

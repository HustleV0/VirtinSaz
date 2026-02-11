"use client"

import React, { createContext, useContext, ReactNode } from "react"

interface Stat {
  value: string
  label: string
}

interface SiteContextType {
  stats: Stat[]
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: ReactNode }) {
  const stats = [
    { value: "+۵۰۰", label: "رستوران و کافه فعال" },
    { value: "+۱۰,۰۰۰", label: "سفارش موفق" },
    { value: "+۵۰", label: "قالب حرفه‌ای" },
    { value: "۲۴/۷", label: "پشتیبانی اختصاصی" },
  ]

  return (
    <SiteContext.Provider value={{ stats }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider")
  }
  return context
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SiteCategory, Theme } from "@/types"

export function Themes() {
  const [categories, setCategories] = useState<SiteCategory[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = "http://localhost:8000/api"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, themesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/site-categories/`),
          fetch(`${API_BASE_URL}/themes/`)
        ])
        
        const catsData = await catsRes.json()
        const themesData = await themesRes.json()
        
        setCategories(catsData)
        setThemes(themesData)
        
        if (catsData.length > 0) {
          setActiveCategoryId(catsData[0].id)
        }
        
        if (themesData.length > 0) {
          setActiveTheme(themesData[0])
        }
      } catch (error) {
        console.error("Error fetching landing data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const filteredThemes = activeCategoryId 
    ? themes.filter(t => t.category === activeCategoryId || (t.site_types && categories.find(c => c.id === activeCategoryId) && t.site_types.includes(categories.find(c => c.id === activeCategoryId)!.slug)))
    : themes

  useEffect(() => {
    if (filteredThemes.length > 0) {
      setActiveTheme(filteredThemes[0])
    } else {
      setActiveTheme(null)
    }
  }, [activeCategoryId, themes])

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section id="themes" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            تم‌های آماده و زیبا
          </h2>
          <p className="text-lg text-muted-foreground">
            تم مورد نظر خود را انتخاب کنید و به راحتی شخصی‌سازی کنید.
          </p>
        </motion.div>

        {/* Category Selector - Only show if categories > 1 */}
        {categories.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex flex-wrap justify-center gap-3"
          >
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategoryId === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategoryId(cat.id)}
                className="gap-2"
              >
                {cat.name}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Theme List for Selected Category (if categories > 1) or all themes */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {filteredThemes.map((theme) => (
            <Button
              key={theme.id}
              variant={activeTheme?.id === theme.id ? "secondary" : "ghost"}
              onClick={() => setActiveTheme(theme)}
              className="px-6 py-2"
            >
              {theme.name}
              {theme.tag && (
                <Badge variant="outline" className="mr-2 border-primary text-primary">
                  {theme.tag}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Theme Preview */}
        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {activeTheme && (
              <motion.div
                key={activeTheme.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  {/* Browser Chrome */}
                  <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/60" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                      <div className="h-3 w-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 px-4">
                      <div className="mx-auto max-w-md rounded-md bg-background px-4 py-1.5 text-center text-xs text-muted-foreground ltr">
                        {activeTheme.slug}.menusaz.ir
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      پیش‌نمایش
                    </Button>
                  </div>

                  {/* Theme Preview Content */}
                  <div className="aspect-[16/9] relative bg-muted flex items-center justify-center">
                    {activeTheme.preview_image ? (
                      <img 
                        src={activeTheme.preview_image} 
                        alt={activeTheme.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">بدون تصویر پیش‌نمایش</div>
                    )}
                  </div>
                </div>

                {/* Theme Info */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{activeTheme.name}</h3>
                    {theme.tag && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                        {theme.tag}
                      </Badge>
                    )}
                  </div>
                  {activeTheme.description && (
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      {activeTheme.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SiteCategory, Template } from "@/types"

export function Templates() {
  const [categories, setCategories] = useState<SiteCategory[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = "http://localhost:8000/api"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, tempsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/site-categories/`),
          fetch(`${API_BASE_URL}/templates/`)
        ])
        
        const catsData = await catsRes.json()
        const tempsData = await tempsRes.json()
        
        setCategories(catsData)
        setTemplates(tempsData)
        
        if (catsData.length > 0) {
          setActiveCategoryId(catsData[0].id)
        }
        
        if (tempsData.length > 0) {
          setActiveTemplate(tempsData[0])
        }
      } catch (error) {
        console.error("Error fetching landing data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const filteredTemplates = activeCategoryId 
    ? templates.filter(t => t.category === activeCategoryId)
    : templates

  useEffect(() => {
    if (filteredTemplates.length > 0) {
      setActiveTemplate(filteredTemplates[0])
    } else {
      setActiveTemplate(null)
    }
  }, [activeCategoryId, templates])

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section id="templates" className="py-24">
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
            قالب‌های آماده و زیبا
          </h2>
          <p className="text-lg text-muted-foreground">
            قالب مورد نظر خود را انتخاب کنید و به راحتی شخصی‌سازی کنید.
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

        {/* Template List for Selected Category (if categories > 1) or all templates */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {filteredTemplates.map((template) => (
            <Button
              key={template.id}
              variant={activeTemplate?.id === template.id ? "secondary" : "ghost"}
              onClick={() => setActiveTemplate(template)}
              className="px-6 py-2"
            >
              {template.name}
              {template.tag && (
                <Badge variant="outline" className="mr-2 border-primary text-primary">
                  {template.tag}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Template Preview */}
        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {activeTemplate && (
              <motion.div
                key={activeTemplate.id}
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
                        {activeTemplate.slug}.menusaz.ir
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      پیش‌نمایش
                    </Button>
                  </div>

                  {/* Theme Preview Content */}
                  <div className="aspect-[16/9] relative bg-muted flex items-center justify-center">
                    {activeTemplate.preview_image ? (
                      <img 
                        src={activeTemplate.preview_image} 
                        alt={activeTemplate.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">بدون تصویر پیش‌نمایش</div>
                    )}
                  </div>
                </div>

                {/* Template Info */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{activeTemplate.name}</h3>
                    {activeTemplate.tag && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                        {activeTemplate.tag}
                      </Badge>
                    )}
                  </div>
                  {activeTemplate.description && (
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      {activeTemplate.description}
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

import { create } from 'zustand'
import { Site, Plugin } from '@/types'
import { api } from '@/lib/api'

interface SiteState {
  site: Site | null
  activePlugins: string[]
  isLoading: boolean
  error: string | null
  fetchSite: () => Promise<void>
  isPluginActive: (pluginKey: string) => boolean
  togglePlugin: (pluginKey: string, isActive: boolean) => Promise<void>
}

export const useSiteStore = create<SiteState>((set, get) => ({
  site: null,
  activePlugins: [],
  isLoading: false,
  error: null,

  fetchSite: async () => {
    set({ isLoading: true, error: null })
    try {
      const siteData = await api.get('/sites/site/me/')
      set({ 
        site: siteData, 
        activePlugins: siteData.active_plugins || [], 
        isLoading: false 
      })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  isPluginActive: (pluginKey: string) => {
    const { activePlugins } = get()
    return activePlugins.includes(pluginKey)
  },

  togglePlugin: async (pluginKey: string, isActive: boolean) => {
    try {
      await api.post('/sites/site/toggle-plugin/', {
          plugin_key: pluginKey,
          is_active: isActive
      })
      
      // Optimistic update
      set((state) => ({
        activePlugins: isActive 
          ? [...state.activePlugins, pluginKey] 
          : state.activePlugins.filter(key => key !== pluginKey)
      }))
    } catch (err: any) {
      console.error("Failed to toggle plugin", err)
      throw err
    }
  }
}))

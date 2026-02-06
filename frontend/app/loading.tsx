"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Premium Icon Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          {/* Outer Pulsing Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-[-20px] rounded-full bg-primary"
          />
          
          {/* Icon Circle */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 border border-primary/10 shadow-2xl backdrop-blur-sm">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <UtensilsCrossed className="h-10 w-10 text-primary" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Brand Name & Tagline */}
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0px" }}
            animate={{ opacity: 1, letterSpacing: "4px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl font-black uppercase tracking-[0.2em] text-primary">
              Meno<span className="text-muted-foreground opacity-50">Saz</span>
            </span>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.3em]"
          >
            Digital Dining Experience
          </motion.p>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-16 w-48 h-[2px] bg-muted relative overflow-hidden rounded-full">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-primary shadow-[0_0_10px_rgba(0,0,0,0.2)]"
          />
        </div>
      </div>
    </div>
  )
}

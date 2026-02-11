'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Command } from 'lucide-react'

export default function VerifiedPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white overflow-hidden relative selection:bg-white/20">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[20%] left-[50%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/[0.05] blur-[150px] -translate-x-1/2" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md p-8 text-center"
            >
                <div className="flex justify-center mb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
                    >
                        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-syne text-4xl font-bold mb-4"
                >
                    Verified.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-zinc-500 text-lg mb-8"
                >
                    Your access to V_Nexus has been confirmed.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link href="/dashboard">
                        <Button className="w-full bg-white text-black hover:bg-zinc-200 h-12 rounded-full font-medium transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group">
                            <span>Proceed to Dashboard</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-30">
                <div className="flex items-center gap-2">
                    <Command size={14} />
                    <span className="font-syne text-xs tracking-widest uppercase">V_Nexus</span>
                </div>
            </div>
        </div>
    )
}

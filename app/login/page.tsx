'use client'

import React from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Loader2, Command } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage(props: { searchParams: Promise<{ message: string, error: string }> }) {
    // Unwrap the promise for searchParams
    const params = React.use(props.searchParams)

    return (
        <div className="min-h-screen w-full flex bg-[#050505] text-white overflow-hidden relative selection:bg-white/20">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-white/[0.02] blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/[0.03] blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            </div>

            {/* Main Content Grid */}
            <div className="w-full h-full z-10 grid lg:grid-cols-2 relative">

                {/* Left Side: Brand / Visual (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/5 bg-white/[0.01]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2"
                    >
                        <div className="h-8 w-8 bg-white text-black flex items-center justify-center rounded-md">
                            <Command size={16} strokeWidth={3} />
                        </div>
                        <span className="font-syne font-bold text-xl tracking-tight">V</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="max-w-md"
                    >
                        <h1 className="font-syne text-5xl font-bold leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                            Master your digital existence.
                        </h1>
                        <p className="text-zinc-500 text-lg leading-relaxed">
                            Orchestrate habits, finance, and knowledge in one seamless, high-performance interface.
                        </p>
                    </motion.div>

                    <div className="text-zinc-700 text-xs uppercase tracking-widest font-mono">
                        © 2026 V Inc.
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 w-full max-w-2xl mx-auto">

                    {/* Mobile Logo (Visible only on mobile) */}
                    <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2 md:top-8 md:left-8 z-50">
                        <div className="h-8 w-8 bg-white text-black flex items-center justify-center rounded-md">
                            <Command size={16} strokeWidth={3} />
                        </div>
                        <span className="font-syne font-bold text-xl tracking-tight">V</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-sm space-y-8"
                    >
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                            <p className="text-zinc-500 text-sm">Enter your credentials to access the nexus.</p>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2 group">
                                    <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider font-mono group-focus-within:text-white transition-colors">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder="name@example.com"
                                            required
                                            className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 py-4 md:py-6 text-base md:text-lg placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-white transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider font-mono group-focus-within:text-white transition-colors">Password</Label>
                                        <Link href="#" className="text-xs text-zinc-600 hover:text-white transition-colors">Forgot?</Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 py-4 md:py-6 text-base md:text-lg placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-white transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {(params.message || params.error) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={cn(
                                        "p-3 text-sm rounded-md bg-white/5 border border-white/10 text-center",
                                        params.error ? "text-red-400 border-red-500/20 bg-red-500/5" : "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                                    )}
                                >
                                    {params.error || params.message}
                                </motion.div>
                            )}

                            <div className="pt-4">
                                <SubmitButton
                                    formAction={login}
                                    className="w-full bg-white text-black hover:bg-zinc-200 h-12 rounded-full font-medium transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    <span>Enter V</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </SubmitButton>
                            </div>
                        </form>

                        <div className="text-center">
                            <p className="text-zinc-500 text-sm">
                                New here?{' '}
                                <Link href="/signup" className="text-white hover:underline underline-offset-4 decoration-zinc-700 transition-all">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useState } from 'react'
import { signup } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Command, Check } from 'lucide-react'
import { signupSchema } from '@/lib/auth-schemas'
import { cn } from '@/lib/utils'

export default function SignupPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(null)
        setFieldErrors({})

        const rawData = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
        }

        const result = signupSchema.safeParse(rawData)

        if (!result.success) {
            const formattedErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string
                formattedErrors[path] = issue.message
            })
            setFieldErrors(formattedErrors)
            if (formattedErrors.confirm_password) {
                setError(formattedErrors.confirm_password)
            } else if (Object.keys(formattedErrors).length > 0) {
                setError(Object.values(formattedErrors)[0])
            }
            setIsSubmitting(false)
            return
        }

        await signup(formData)
        setIsSubmitting(false)
    }

    return (
        <div className="min-h-screen w-full flex bg-[#050505] text-white overflow-hidden relative selection:bg-white/20">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-white/[0.02] blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/[0.03] blur-[150px]" />
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
                        <span className="font-syne font-bold text-xl tracking-tight">V_Nexus</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="max-w-md"
                    >
                        <h1 className="font-syne text-5xl font-bold leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                            Begin your journey.
                        </h1>
                        <p className="text-zinc-500 text-lg leading-relaxed">
                            Join the architects of the future. Build a life of precision and purpose.
                        </p>
                    </motion.div>

                    <div className="text-zinc-700 text-xs uppercase tracking-widest font-mono">
                        © 2026 V_Nexus Inc.
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 w-full max-w-2xl mx-auto overflow-y-auto">

                    {/* Mobile Logo */}
                    <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                        <div className="h-8 w-8 bg-white text-black flex items-center justify-center rounded-md">
                            <Command size={16} strokeWidth={3} />
                        </div>
                        <span className="font-syne font-bold text-xl tracking-tight">V_Nexus</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-sm space-y-8 mt-12 lg:mt-0"
                    >
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-2xl font-semibold tracking-tight">Create Account</h2>
                            <p className="text-zinc-500 text-sm">Initialize your profile.</p>
                        </div>

                        <form action={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2 group">
                                    <Label htmlFor="full_name" className="text-zinc-400 text-xs uppercase tracking-wider font-mono group-focus-within:text-white transition-colors">Full Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            placeholder="John Doe"
                                            required
                                            className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 py-4 text-lg placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-white transition-all duration-300"
                                        />
                                    </div>
                                    {fieldErrors.full_name && <p className="text-xs text-red-400">{fieldErrors.full_name}</p>}
                                </div>

                                <div className="space-y-2 group">
                                    <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider font-mono group-focus-within:text-white transition-colors">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 py-4 text-lg placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-white transition-all duration-300"
                                        />
                                    </div>
                                    {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
                                </div>

                                <div className="space-y-2 group">
                                    <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider font-mono group-focus-within:text-white transition-colors">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 py-4 text-lg placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-white transition-all duration-300"
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-600">Min 12 chars, uppercase, lowercase, number, symbol.</p>
                                    {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
                                </div>

                                <div className="space-y-2 group">
                                    <Label htmlFor="confirm_password" className="text-zinc-400 text-xs uppercase tracking-wider font-mono group-focus-within:text-white transition-colors">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm_password"
                                            name="confirm_password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value)
                                                if (error) setError(null)
                                            }}
                                            required
                                            className="bg-transparent border-0 border-b border-zinc-800 rounded-none px-0 py-4 text-lg placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-white transition-all duration-300"
                                        />
                                    </div>
                                    {fieldErrors.confirm_password && (
                                        <p className="text-xs text-red-400">{fieldErrors.confirm_password}</p>
                                    )}
                                </div>
                            </div>

                            {error && !fieldErrors.confirm_password && (
                                <p className="text-sm text-red-400 mt-1 text-center">
                                    {error}
                                </p>
                            )}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black hover:bg-zinc-200 h-12 rounded-full font-medium transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2 text-zinc-500">Processing...</span>
                                    ) : (
                                        <>
                                            <span>Initialize Account</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="text-center">
                            <p className="text-zinc-500 text-sm">
                                Already have an account?{' '}
                                <Link href="/login" className="text-white hover:underline underline-offset-4 decoration-zinc-700 transition-all">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}


import { Sidebar } from '@/components/sidebar'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getUserSettings } from '@/app/dashboard/settings/actions'
import { ThemeSync } from '@/components/theme-sync'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DashboardContent } from '@/components/dashboard-content'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { FloatingDock } from '@/components/mobile/floating-dock'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const userSettings = await getUserSettings()

    const headersList = await headers()
    const deviceType = headersList.get('x-device-type')

    return (
        <div className="flex min-h-screen relative">
            {/* Desktop Sidebar - Fixed Position */}
            <aside className="hidden md:block w-64 fixed top-0 left-0 h-screen z-40 bg-background/50 backdrop-blur-md border-r">
                <Sidebar isAdmin={user.email === process.env.ADMIN_EMAIL} className="h-full" />
            </aside>

            {/* Main Content Area - Padded to respect fixed sidebar */}
            <div className="flex-1 flex flex-col min-h-screen relative z-10 min-w-0 md:pl-64">
                <ThemeSync userTheme={userSettings?.settings?.theme} userId={user.id} />

                {/* Mobile Header - Cinematic Redesign */}
                <div className="md:hidden flex items-center justify-between p-4 sticky top-0 z-50">
                    <Link href="/dashboard" className="font-syne font-bold text-xl tracking-tight text-foreground/90 backdrop-blur-md bg-background/30 rounded-full px-4 py-1.5 border border-white/5 shadow-sm">
                        V_Nexus
                    </Link>
                    <div className="backdrop-blur-md bg-background/30 rounded-full p-1 border border-white/5 shadow-sm">
                        <ThemeToggle />
                    </div>
                </div>

                {/* New Floating Dock for Mobile */}
                <FloatingDock user={user} isAdmin={user.email === process.env.ADMIN_EMAIL} />

                <DashboardContent deviceType={deviceType}>
                    {children}
                </DashboardContent>
            </div>
        </div>
    )
}

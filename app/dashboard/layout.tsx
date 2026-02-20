
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
import { MobileHeader } from '@/components/mobile/mobile-header'

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
            <aside className="hidden md:block w-64 fixed top-0 left-0 h-screen z-40 bg-transparent border-none">
                <Sidebar isAdmin={user.email === process.env.ADMIN_EMAIL} className="h-full" />
            </aside>

            {/* Main Content Area - Padded to respect fixed sidebar */}
            <div className="flex-1 flex flex-col min-h-screen relative z-10 min-w-0 md:pl-64">
                <ThemeSync userTheme={userSettings?.settings?.theme} userId={user.id} />

                {/* Mobile Header - Cinematic Redesign */}
                <MobileHeader />

                {/* New Floating Dock for Mobile */}
                <FloatingDock user={user} isAdmin={user.email === process.env.ADMIN_EMAIL} />

                <DashboardContent deviceType={deviceType}>
                    {children}
                </DashboardContent>
            </div>
        </div>
    )
}


import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from '../components/ui/PageTransition';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-background text-text-primary font-satoshi overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname} className="max-w-7xl mx-auto">
                            {children}
                        </PageTransition>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

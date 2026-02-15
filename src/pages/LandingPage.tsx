import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { HeroSection } from '../components/landing/HeroSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { SocialProofSection } from '../components/landing/SocialProofSection'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { PricingSection } from '../components/landing/PricingSection'
import { FooterSection } from '../components/landing/FooterSection'
import { PageTransition } from '../components/ui/PageTransition'

function Navbar() {
    return (
        <nav
            role="navigation"
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg-primary/70 border-b border-border-subtle/50"
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <Flame className="w-6 h-6 text-accent-primary group-hover:text-accent-hover transition-colors duration-200" />
                    <span className="text-xl font-bold text-text-primary font-satoshi tracking-tight">
                        HabitForge
                    </span>
                </Link>

                {/* Nav links (desktop) */}
                <div className="hidden sm:flex items-center gap-8">
                    <a
                        href="#features"
                        className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors duration-200"
                    >
                        Features
                    </a>
                    <a
                        href="#pricing"
                        className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors duration-200"
                    >
                        Pricing
                    </a>
                </div>

                {/* Auth buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/sign-in"
                        className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors duration-200"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/sign-up"
                        className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default function LandingPage() {
    return (
        <PageTransition className="min-h-screen bg-bg-primary font-satoshi">
            <Navbar />
            <main className="pt-16">
                <HeroSection />
                <FeaturesSection />
                <SocialProofSection />
                <HowItWorksSection />
                <PricingSection />
            </main>
            <FooterSection />
        </PageTransition>
    )
}

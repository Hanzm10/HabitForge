import { Link } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import PixelCard from './PixelCard'

const freeTierFeatures = [
    'Up to 30 habits',
    'Daily completion tracking',
    'Streak counter',
    'Calendar heatmap',
    'Basic analytics',
]

const proTierFeatures = [
    'Unlimited habits',
    'Advanced analytics',
    'Weekly & monthly reports',
    'Priority support',
    'Custom themes',
    'Data export',
]

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 px-6 bg-bg-secondary/30">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-section text-text-primary font-satoshi mb-4">
                        Simple,{' '}
                        <span className="text-accent-primary">transparent</span> pricing
                    </h2>
                    <p className="text-text-secondary text-lg">
                        Start free. Upgrade when you're ready.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Free Tier */}
                    <div className="relative">
                        <div className="absolute -top-3 left-8 z-10">
                            <span className="px-3 py-1 text-xs font-bold bg-accent-primary text-white rounded-full uppercase tracking-wider">
                                Popular
                            </span>
                        </div>
                        <PixelCard variant="default" className="h-auto w-full p-8 items-start border-2 border-accent-primary">
                            <div className="w-full">
                                <h3 className="text-2xl font-bold text-text-primary font-satoshi mb-2">
                                    Free
                                </h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold text-text-primary">$0</span>
                                    <span className="text-text-muted">/month</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {freeTierFeatures.map((f) => (
                                        <li key={f} className="flex items-center gap-3 text-text-secondary">
                                            <Check className="w-5 h-5 text-success flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/sign-up"
                                    className="block w-full text-center px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </PixelCard>
                    </div>

                    {/* Pro Tier */}
                    <div className="relative">
                        <div className="absolute -top-3 left-8 z-10">
                            <span className="px-3 py-1 text-xs font-bold bg-bg-secondary text-text-muted rounded-full uppercase tracking-wider border border-border-subtle">
                                Coming Soon
                            </span>
                        </div>
                        <PixelCard variant="black" className="h-auto w-full p-8 items-start opacity-80">
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-2xl font-bold text-text-primary font-satoshi">
                                        Pro
                                    </h3>
                                    <Zap className="w-5 h-5 text-warning" />
                                </div>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold text-text-muted">$5</span>
                                    <span className="text-text-muted">/month</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {proTierFeatures.map((f) => (
                                        <li key={f} className="flex items-center gap-3 text-text-muted">
                                            <Check className="w-5 h-5 text-text-muted flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    disabled
                                    className="block w-full text-center px-6 py-3 bg-bg-secondary text-text-muted font-semibold rounded-xl cursor-not-allowed border border-border-subtle"
                                >
                                    Coming Soon
                                </button>
                            </div>
                        </PixelCard>
                    </div>
                </div>
            </div>
        </section>
    )
}

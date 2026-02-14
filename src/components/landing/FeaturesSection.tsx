import { Flame, CheckCircle2, BarChart3, Sparkles } from 'lucide-react'

const features = [
    {
        icon: Flame,
        title: 'Streak Tracking',
        description:
            'Build unbreakable chains of consistency. Watch your streaks grow and never want to break them.',
        gradient: 'from-orange-500/20 to-red-500/20',
        iconColor: 'text-orange-400',
    },
    {
        icon: CheckCircle2,
        title: 'Daily Completion',
        description:
            'One tap to mark your habit done. Simple, satisfying, and designed to keep you going.',
        gradient: 'from-emerald-500/20 to-green-500/20',
        iconColor: 'text-success',
    },
    {
        icon: BarChart3,
        title: 'Progress Analytics',
        description:
            'Beautiful charts and insights that show your consistency over weeks and months.',
        gradient: 'from-accent-primary/20 to-blue-500/20',
        iconColor: 'text-accent-hover',
    },
    {
        icon: Sparkles,
        title: 'Clean Interface',
        description:
            'No clutter, no distractions. A focused dark UI designed for people who value their time.',
        gradient: 'from-purple-500/20 to-pink-500/20',
        iconColor: 'text-purple-400',
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-section text-text-primary font-satoshi mb-4">
                        Everything you need to{' '}
                        <span className="text-accent-primary">stay consistent</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Powerful features wrapped in a beautiful interface. No bloat, no noise — just the tools
                        that matter.
                    </p>
                </div>

                {/* Feature cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="group relative p-8 rounded-2xl border border-border-subtle bg-bg-card hover:border-accent-primary/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Gradient glow on hover */}
                            <div
                                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`}
                            />
                            <div
                                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-bg-secondary mb-5`}
                            >
                                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary font-satoshi mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

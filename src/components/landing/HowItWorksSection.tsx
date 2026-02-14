import { PlusCircle, CheckSquare, TrendingUp } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: PlusCircle,
        title: 'Create',
        description:
            'Define your habits with custom names, colors, and icons. Set daily or weekly frequencies.',
        gradient: 'from-accent-primary to-accent-hover',
    },
    {
        number: '02',
        icon: CheckSquare,
        title: 'Track',
        description:
            'One tap each day to mark it done. Watch your calendar fill up with beautiful completion tiles.',
        gradient: 'from-success to-success-hover',
    },
    {
        number: '03',
        icon: TrendingUp,
        title: 'Build Streaks',
        description:
            'Stay consistent and watch your streaks grow. Analytics show your progress over weeks and months.',
        gradient: 'from-warning to-orange-400',
    },
]

export function HowItWorksSection() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-section text-text-primary font-satoshi mb-4">
                        How It Works
                    </h2>
                    <p className="text-text-secondary text-lg">
                        Three simple steps to build lasting habits.
                    </p>
                </div>

                {/* Steps */}
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <li
                            key={step.title}
                            className="relative text-center group"
                        >
                            {/* Connector line (desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-gradient-to-r from-border-subtle to-transparent" />
                            )}

                            {/* Step number + icon */}
                            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-bg-card border border-border-subtle mb-6 group-hover:border-accent-primary/30 transition-all duration-300">
                                <div
                                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                                />
                                <step.icon className="w-10 h-10 text-text-secondary group-hover:text-accent-primary transition-colors duration-300" />
                                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-accent-primary text-white text-xs font-bold flex items-center justify-center">
                                    {step.number}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary font-satoshi mb-3">
                                {step.title}
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}

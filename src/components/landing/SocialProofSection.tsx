import { Star } from 'lucide-react'

const testimonials = [
    {
        name: 'Alex Chen',
        role: 'Software Engineer',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=6366F1&color=fff',
        quote:
            'HabitForge turned my scattered routines into something I actually stick to. The streak counter is addictive in the best way.',
        rating: 5,
    },
    {
        name: 'Sarah Kim',
        role: 'Product Designer',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=10B981&color=fff',
        quote:
            'Finally, a habit tracker that looks as good as it works. The dark theme and clean UI make me want to open it every day.',
        rating: 5,
    },
    {
        name: 'Marcus Johnson',
        role: 'Entrepreneur',
        avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=F59E0B&color=fff',
        quote:
            'I\'ve tried dozens of habit apps. HabitForge is the first one that doesn\'t feel like a chore to use. It\'s genuinely beautiful.',
        rating: 5,
    },
]

export function SocialProofSection() {
    return (
        <section className="py-24 px-6 bg-bg-secondary/30">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-section text-text-primary font-satoshi mb-4">
                        Loved by{' '}
                        <span className="text-accent-primary">builders</span>
                    </h2>
                    <p className="text-text-secondary text-lg">
                        Join thousands who have transformed their habits.
                    </p>
                </div>

                {/* Testimonial cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <article
                            key={t.name}
                            className="p-7 rounded-2xl border border-border-subtle bg-bg-card hover:border-accent-primary/20 transition-all duration-300"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-warning text-warning"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-text-secondary leading-relaxed mb-6">
                                "{t.quote}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-10 h-10 rounded-full"
                                    loading="lazy"
                                    width={40}
                                    height={40}
                                />
                                <div>
                                    <p className="text-text-primary font-medium text-sm">
                                        {t.name}
                                    </p>
                                    <p className="text-text-muted text-xs">{t.role}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

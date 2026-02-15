import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import Antigravity from '../ui/Antigravity'
import BlurText from '../ui/BlurText'

export function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        >
            {/* Antigravity Background */}
            <div className="absolute inset-0">
                <Antigravity
                    count={1000}
                    magnetRadius={10}
                    ringRadius={10}
                    waveSpeed={1.4}
                    waveAmplitude={1}
                    particleSize={0.5}
                    lerpSpeed={0.01}
                    color="#6366F1"
                    autoAnimate
                    particleVariance={0.1}
                    particleShape="sphere"
                    fieldStrength={20}
                />
            </div>
            {/* Gradient glow background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] rounded-full bg-accent-primary/10 blur-[120px] animate-glow-pulse" />
            </div>
            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-bg-secondary/60 backdrop-blur-sm mb-8 animate-fade-in pointer-events-auto">
                    <Flame className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm text-text-secondary font-medium">
                        The modern habit tracker
                    </span>
                </div>

                {/* Headline */}
                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-hero text-text-primary font-satoshi mb-6 animate-slide-up pointer-events-auto flex flex-wrap justify-center gap-x-3 gap-y-2">
                    <BlurText
                        text="Build Systems."
                        delay={100}
                        animateBy="words"
                        direction="bottom"
                        className="text-text-primary inline-flex"
                    />
                    <BlurText
                        text="Not Motivation."
                        delay={200}
                        animateBy="words"
                        direction="bottom"
                        className="bg-gradient-to-r from-accent-primary to-accent-hover bg-clip-text text-transparent inline-flex"
                        animationFrom={{ opacity: 0, y: 50 }}
                        animationTo={[
                            { opacity: 0.5, y: -5 },
                            { opacity: 1, y: 0 },
                        ]}
                    />
                </h1>

                {/* Subtext */}
                <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up animation-delay-100 pointer-events-auto">
                    A premium habit tracker that turns daily discipline into visual progress —
                    with streaks, analytics, and a distraction-free interface.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-200 pointer-events-auto">
                    <Link
                        to="/sign-up"
                        className="group px-8 py-3.5 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5"
                    >
                        Start Tracking
                        <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </Link>
                    <a
                        href="#features"
                        className="px-8 py-3.5 border border-border-subtle hover:border-accent-primary/50 text-text-secondary hover:text-text-primary rounded-xl font-medium transition-all duration-300"
                    >
                        See Features
                    </a>
                </div>

                {/* Social proof mini */}
                <p className="mt-12 text-text-muted text-sm animate-fade-in animation-delay-300 pointer-events-auto">
                    Trusted by <span className="text-text-secondary font-medium">2,500+</span> creators &amp; builders
                </p>
            </div>
        </section>
    )
}

import { Flame } from 'lucide-react';

interface LogoProps {
    className?: string;
    iconSize?: number;
    textSize?: string;
    showText?: boolean;
}

export function Logo({
    className = "",
    iconSize = 24,
    textSize = "text-xl",
    showText = true
}: LogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Flame
                size={iconSize}
                className="text-accent-primary"
            />
            {showText && (
                <span className={`${textSize} font-bold text-text-primary font-satoshi tracking-tight`}>
                    HabitForge
                </span>
            )}
        </div>
    );
}

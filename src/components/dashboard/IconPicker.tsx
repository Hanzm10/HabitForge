export const IconPicker = ({ value, onChange }: { value: string; onChange: (icon: string) => void }) => {
    const icons = ['🏃', '📚', '💧', '🧘', '💻', '🎨', '🎵', '🍳', '🧹', '💤', '📝', '💰', '🌿', '💊', '🏋️'];

    return (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">Icon</label>
            <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
                {icons.map((icon) => (
                    <button
                        key={icon}
                        type="button"
                        onClick={() => onChange(icon)}
                        aria-pressed={value === icon}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all duration-200 ${value === icon
                                ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/25 scale-110'
                                : 'bg-bg-secondary text-text-primary hover:bg-white/5 border border-border-subtle hover:border-accent-primary/30'
                            }`}
                    >
                        {icon}
                    </button>
                ))}
            </div>
        </div>
    );
};

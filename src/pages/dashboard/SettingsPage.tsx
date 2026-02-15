import { SignOutButton, useUser, useClerk } from '@clerk/clerk-react';
import { LogOut, User } from 'lucide-react';

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();

    if (!isLoaded || !user) {
        return (
            <div className="min-h-full bg-bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-bg-primary">
            {/* Consistent container for both sections */}
            <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 pt-16">
                <header className="px-2">
                    <h1 className="text-4xl font-extrabold text-text-primary font-satoshi mb-2 tracking-tight">Settings</h1>
                    <p className="text-text-secondary text-lg font-medium opacity-80">Manage your profile, security, and preferences.</p>
                </header>

                <div className="space-y-8">
                    {/* Custom Profile Details Section */}
                    <div className="bg-bg-card rounded-2xl border border-border-subtle shadow-xl overflow-hidden">
                        <div className="px-8 pt-8 pb-6 border-b border-border-subtle bg-white/5">
                            <h2 className="text-xl font-bold text-text-primary font-satoshi">Profile details</h2>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-0 py-10 px-8 border-b border-border-subtle">
                            <div className="md:w-1/4">
                                <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.15em] pt-1">Profile</p>
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <img
                                            src={user.imageUrl}
                                            alt={user.fullName || 'User'}
                                            className="w-16 h-16 rounded-full border-2 border-border-subtle group-hover:border-accent-primary transition-colors object-cover"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <User size={20} className="text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-text-primary font-bold text-lg">{user.fullName}</p>
                                        <p className="text-text-secondary text-sm font-medium opacity-70">Personal information and avatar</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openUserProfile()}
                                    className="text-accent-primary hover:text-accent-hover font-bold transition-colors text-sm px-4 py-2 hover:bg-accent-primary/5 rounded-lg text-left sm:text-center"
                                >
                                    Update profile
                                </button>
                            </div>
                        </div>

                        {/* Email Addresses */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-0 py-10 px-8 border-b border-border-subtle">
                            <div className="md:w-1/4">
                                <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.15em] pt-1">Email Addresses</p>
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-3">
                                    {user.emailAddresses.map((email) => (
                                        <div key={email.id} className="flex items-center gap-2">
                                            <span className="text-text-primary font-medium">{email.emailAddress}</span>
                                            {email.id === user.primaryEmailAddressId && (
                                                <span className="bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => openUserProfile()}
                                        className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover font-bold transition-colors text-xs"
                                    >
                                        <span className="text-lg">+</span> Add email address
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Connected Accounts / Security Placeholder Link */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-0 py-10 px-8">
                            <div className="md:w-1/4">
                                <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.15em] pt-1">Connected Accounts</p>
                            </div>
                            <div className="flex-1">
                                <button
                                    onClick={() => openUserProfile()}
                                    className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover font-bold transition-colors text-xs"
                                >
                                    <span className="text-lg">+</span> Connect account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-bg-card rounded-2xl border border-border-subtle shadow-xl overflow-hidden">
                        <div className="px-8 pt-8 pb-6 border-b border-border-subtle bg-white/5">
                            <h2 className="text-xl font-bold text-text-primary font-satoshi">Account Actions</h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 md:gap-0 py-10 px-8">
                            <div className="md:w-1/4">
                                <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.15em] pt-1">Authentication</p>
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-text-primary font-bold text-lg">Sign Out</p>
                                    <p className="text-text-secondary text-sm font-medium opacity-70">Log out of your current session on this device.</p>
                                </div>
                                <SignOutButton>
                                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all font-bold border border-red-500/20 shadow-sm active:scale-95">
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </SignOutButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { motion } from 'motion/react';
import React from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] // Custom easeOutExpo
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

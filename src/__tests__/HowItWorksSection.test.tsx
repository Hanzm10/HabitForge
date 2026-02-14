import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'

describe('HowItWorksSection', () => {
    it('renders 3 steps', () => {
        render(<HowItWorksSection />)
        const steps = screen.getAllByRole('listitem')
        expect(steps).toHaveLength(3)
    })

    it('renders the correct step labels', () => {
        render(<HowItWorksSection />)
        expect(screen.getByText(/create/i)).toBeInTheDocument()
        expect(screen.getByText(/track/i)).toBeInTheDocument()
        expect(screen.getByText(/build streaks/i)).toBeInTheDocument()
    })
})

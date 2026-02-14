import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FeaturesSection } from '../components/landing/FeaturesSection'

describe('FeaturesSection', () => {
    it('renders exactly 4 feature cards', () => {
        render(<FeaturesSection />)
        const cards = screen.getAllByRole('article')
        expect(cards).toHaveLength(4)
    })

    it('renders correct feature titles', () => {
        render(<FeaturesSection />)
        expect(screen.getByText(/streak tracking/i)).toBeInTheDocument()
        expect(screen.getByText(/daily completion/i)).toBeInTheDocument()
        expect(screen.getByText(/progress analytics/i)).toBeInTheDocument()
        expect(screen.getByText(/clean interface/i)).toBeInTheDocument()
    })
})

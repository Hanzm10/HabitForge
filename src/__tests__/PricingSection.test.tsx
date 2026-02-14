import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { PricingSection } from '../components/landing/PricingSection'

describe('PricingSection', () => {
    it('renders Free and Pro tier headings', () => {
        render(<PricingSection />, { wrapper: BrowserRouter })
        const headings = screen.getAllByRole('heading', { level: 3 })
        const headingTexts = headings.map((h) => h.textContent)
        expect(headingTexts).toContain('Free')
        expect(headingTexts).toContain('Pro')
    })

    it('Free tier has a CTA button', () => {
        render(<PricingSection />, { wrapper: BrowserRouter })
        const cta = screen.getByRole('link', { name: /get started/i })
        expect(cta).toBeInTheDocument()
    })

    it('Pro tier shows Coming Soon badge', () => {
        render(<PricingSection />, { wrapper: BrowserRouter })
        const comingSoonElements = screen.getAllByText(/coming soon/i)
        expect(comingSoonElements.length).toBeGreaterThanOrEqual(1)
    })
})

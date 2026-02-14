import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SocialProofSection } from '../components/landing/SocialProofSection'

describe('SocialProofSection', () => {
    it('renders 3 testimonial cards', () => {
        render(<SocialProofSection />)
        const cards = screen.getAllByRole('article')
        expect(cards).toHaveLength(3)
    })

    it('each testimonial has a name and quote', () => {
        render(<SocialProofSection />)
        const blockquotes = screen.getAllByRole('blockquote')
        expect(blockquotes).toHaveLength(3)
    })
})

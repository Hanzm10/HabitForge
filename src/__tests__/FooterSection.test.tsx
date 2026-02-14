import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { FooterSection } from '../components/landing/FooterSection'

describe('FooterSection', () => {
    it('renders Privacy link', () => {
        render(<FooterSection />, { wrapper: BrowserRouter })
        expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument()
    })

    it('renders Terms link', () => {
        render(<FooterSection />, { wrapper: BrowserRouter })
        expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument()
    })

    it('renders Login link pointing to /sign-in', () => {
        render(<FooterSection />, { wrapper: BrowserRouter })
        const login = screen.getByRole('link', { name: /log in/i })
        expect(login).toHaveAttribute('href', '/sign-in')
    })

    it('renders copyright text', () => {
        render(<FooterSection />, { wrapper: BrowserRouter })
        expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument()
    })
})

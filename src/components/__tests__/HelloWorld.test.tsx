import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HelloWorld from '../HelloWorld'

describe('HelloWorld', () => {
  it('should render the message prop', () => {
    render(<HelloWorld msg="Test Message" />)
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  it('should increment count on button click', async () => {
    const user = userEvent.setup()
    render(<HelloWorld msg="Click Test" />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('count is 0')

    await user.click(button)
    expect(button).toHaveTextContent('count is 1')

    await user.click(button)
    expect(button).toHaveTextContent('count is 2')
  })
})

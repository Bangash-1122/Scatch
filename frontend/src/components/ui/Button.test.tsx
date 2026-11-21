import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders its label and fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Add to cart</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and marked busy while loading', () => {
    render(<Button loading>Saving</Button>)

    const button = screen.getByRole('button', { name: /saving/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Out of stock
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})

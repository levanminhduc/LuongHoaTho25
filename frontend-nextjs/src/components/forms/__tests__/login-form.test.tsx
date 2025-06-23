import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../login-form'

// Mock the auth store
const mockLogin = jest.fn()
jest.mock('@/lib/auth-store', () => ({
  useAuthStore: () => ({
    login: mockLogin,
  }),
}))

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  post: jest.fn(),
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('renders login form with all required fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/vai trò/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tên đăng nhập/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
  })

  it('changes label when role is switched to employee', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const roleSelect = screen.getByLabelText(/vai trò/i)
    await user.selectOptions(roleSelect, 'employee')

    expect(screen.getByLabelText(/mã nhân viên/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/tên đăng nhập/i)).not.toBeInTheDocument()
  })

  it('updates form data when inputs change', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin123')

    expect(usernameInput).toHaveValue('admin')
    expect(passwordInput).toHaveValue('admin123')
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    
    // Mock a delayed response
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ user: { username: 'admin' }, access_token: 'token' })
      }), 100))
    )

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)

    expect(screen.getByText(/đang đăng nhập/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('handles successful NestJS login', async () => {
    const user = userEvent.setup()
    const mockUserData = { username: 'admin', role: 'admin' }
    const mockToken = 'mock-jwt-token'

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        user: mockUserData,
        access_token: mockToken
      })
    })

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUserData, mockToken)
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('falls back to Express.js when NestJS fails', async () => {
    const user = userEvent.setup()
    const mockUserData = { username: 'admin', role: 'admin' }
    const mockToken = 'express-token'

    // Mock NestJS failure
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('NestJS not available'))

    // Mock Express.js success
    const apiClient = require('@/lib/api-client')
    apiClient.post.mockResolvedValueOnce({
      user: mockUserData,
      token: mockToken
    })

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      }, {
        timeout: 8000,
        retries: 1,
        cache: false
      })
      expect(mockLogin).toHaveBeenCalledWith(mockUserData, mockToken)
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('displays error message on login failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'

    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))
    
    const apiClient = require('@/lib/api-client')
    apiClient.post.mockRejectedValueOnce(new Error(errorMessage))

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'wrong-password')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('displays timeout error message', async () => {
    const user = userEvent.setup()

    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('timeout'))
    
    const apiClient = require('@/lib/api-client')
    apiClient.post.mockRejectedValueOnce(new Error('timeout'))

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/kết nối quá chậm/i)).toBeInTheDocument()
    })
  })

  it('displays network error message', async () => {
    const user = userEvent.setup()

    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'))
    
    const apiClient = require('@/lib/api-client')
    apiClient.post.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/không thể kết nối server/i)).toBeInTheDocument()
    })
  })

  it('prevents form submission when loading', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    )

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/tên đăng nhập/i)
    const passwordInput = screen.getByLabelText(/mật khẩu/i)
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)

    // Wait for loading state
    await waitFor(() => {
      expect(screen.getByText(/đang đăng nhập/i)).toBeInTheDocument()
    })

    // Try to click again - should be disabled
    expect(submitButton).toBeDisabled()
    expect(usernameInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /đăng nhập/i })
    await user.click(submitButton)

    // Form should not submit without required fields
    expect(mockLogin).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyPayrollManagement from '../my-payroll-management'

// Mock the auth store
const mockUser = {
  username: 'EMP001',
  role: 'employee',
  fullName: 'Nguyen Van A'
}
const mockToken = 'mock-jwt-token'

jest.mock('@/lib/auth-store', () => ({
  useAuthStore: () => ({
    user: mockUser,
    token: mockToken,
  }),
}))

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock the hydration hook
jest.mock('@/hooks/use-hydration', () => ({
  useHydration: () => true,
}))

// Mock fetch globally
global.fetch = jest.fn()

// Mock window.confirm
global.confirm = jest.fn()

// Mock window.alert
global.alert = jest.fn()

describe('MyPayrollManagement', () => {
  const mockPayrollData = [
    {
      id: 1,
      ma_nv: 'EMP001',
      ho_ten: 'Nguyen Van A',
      luong_cb: 10000000,
      phu_cap: 2000000,
      thue: 1200000,
      thuc_linh: 10800000,
      da_ky: false,
      ngay_ky: null,
      ten_da_ky: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      ma_nv: 'EMP001',
      ho_ten: 'Nguyen Van A',
      luong_cb: 10000000,
      phu_cap: 2000000,
      thue: 1200000,
      thuc_linh: 10800000,
      da_ky: true,
      ngay_ky: '2024-01-15T00:00:00Z',
      ten_da_ky: 'Nguyen Van A',
      created_at: '2023-12-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
    ;(global.confirm as jest.Mock).mockClear()
    ;(global.alert as jest.Mock).mockClear()
  })

  it('renders loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    )

    render(<MyPayrollManagement />)
    expect(screen.getByText(/đang tải dữ liệu/i)).toBeInTheDocument()
  })

  it('renders payroll data successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/💰 lương của tôi/i)).toBeInTheDocument()
      expect(screen.getByText(/2 bản ghi/i)).toBeInTheDocument()
    })

    // Check if payroll data is displayed
    expect(screen.getByText('10.000.000 ₫')).toBeInTheDocument()
    expect(screen.getByText('2.000.000 ₫')).toBeInTheDocument()
    expect(screen.getByText('10.800.000 ₫')).toBeInTheDocument()
  })

  it('displays correct status badges', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/✓ đã ký/i)).toBeInTheDocument()
      expect(screen.getByText(/⏳ chưa ký/i)).toBeInTheDocument()
    })
  })

  it('shows sign button only for unsigned payrolls', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      const signButtons = screen.getAllByText(/ký xác nhận/i)
      expect(signButtons).toHaveLength(1) // Only one unsigned payroll
    })
  })

  it('handles payroll signing successfully', async () => {
    const user = userEvent.setup()
    
    // Mock initial data fetch
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    // Mock sign request
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'Signed successfully'
      })
    })

    // Mock refetch after signing
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData.map(item => ({ ...item, da_ky: true })),
        success: true
      })
    })

    ;(global.confirm as jest.Mock).mockReturnValue(true)

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/ký xác nhận/i)).toBeInTheDocument()
    })

    const signButton = screen.getByText(/ký xác nhận/i)
    await user.click(signButton)

    expect(global.confirm).toHaveBeenCalledWith(
      'Bạn có chắc chắn muốn ký xác nhận bảng lương này?'
    )

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4002/api/payroll/EMP001/sign',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ho_ten: 'Nguyen Van A',
          }),
        })
      )
    })
  })

  it('cancels signing when user declines confirmation', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    ;(global.confirm as jest.Mock).mockReturnValue(false)

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/ký xác nhận/i)).toBeInTheDocument()
    })

    const signButton = screen.getByText(/ký xác nhận/i)
    await user.click(signButton)

    expect(global.confirm).toHaveBeenCalled()
    
    // Should not make sign request
    expect(global.fetch).toHaveBeenCalledTimes(1) // Only initial fetch
  })

  it('handles signing error', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        message: 'Signing failed'
      })
    })

    ;(global.confirm as jest.Mock).mockReturnValue(true)

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/ký xác nhận/i)).toBeInTheDocument()
    })

    const signButton = screen.getByText(/ký xác nhận/i)
    await user.click(signButton)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Lỗi ký bảng lương: Signing failed')
    })
  })

  it('displays summary statistics correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      // Total payrolls
      expect(screen.getByText('2')).toBeInTheDocument()
      
      // Signed payrolls
      expect(screen.getByText('1')).toBeInTheDocument()
      
      // Unsigned payrolls  
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('handles empty payroll data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [],
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/chưa có dữ liệu lương/i)).toBeInTheDocument()
      expect(screen.getByText(/0 bản ghi/i)).toBeInTheDocument()
    })
  })

  it('handles fetch error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
      expect(screen.getByText(/quay lại dashboard/i)).toBeInTheDocument()
    })
  })

  it('handles API error response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        message: 'Unauthorized access'
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/unauthorized access/i)).toBeInTheDocument()
    })
  })

  it('navigates back to dashboard', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/← quay lại/i)).toBeInTheDocument()
    })

    const backButton = screen.getByText(/← quay lại/i)
    await user.click(backButton)

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('formats currency correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      // Check Vietnamese currency formatting
      expect(screen.getByText('10.000.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('2.000.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('1.200.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('10.800.000 ₫')).toBeInTheDocument()
    })
  })

  it('formats dates correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: mockPayrollData,
        success: true
      })
    })

    render(<MyPayrollManagement />)

    await waitFor(() => {
      expect(screen.getByText(/chưa ký/i)).toBeInTheDocument()
      // Check if signed date is formatted (Vietnamese locale)
      expect(screen.getByText(/15\/1\/2024/)).toBeInTheDocument()
    })
  })
})

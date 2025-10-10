import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// Mock lucide-react icons
jest.mock('react-icons/fa', () => ({
  FaBars: () => <div data-testid="menu">Menu</div>,
  FaTimes: () => <div data-testid="x">X</div>,
  FaUserEdit: () => <div data-testid="user">User</div>,
}));

// Mock the logo import
jest.mock('@/assets/logo.jpeg', () => 'mocked-logo.jpeg');

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar Component', () => {
  test('renders logo and menu', () => {
    renderNavbar();
    expect(screen.getByRole('img')).toHaveAttribute('src'); // logo exists
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  test('handles mobile menu toggle', () => {
    renderNavbar();
    const hamburgerButton = screen.getAllByRole('button')[0];
    fireEvent.click(hamburgerButton);
    expect(hamburgerButton).toBeInTheDocument();
  });
});

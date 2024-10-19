// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page', () => {
    render(<App />);
    const welcomeElement = screen.getByText(/Welcome to FitMe Admin Portal/i);
    expect(welcomeElement).toBeInTheDocument();
});

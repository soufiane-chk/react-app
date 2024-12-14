// src/__tests__/App.test.js
import { render, screen } from '@testing-library/react';
import App from '../App'; // Replace with the correct path to your App component

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

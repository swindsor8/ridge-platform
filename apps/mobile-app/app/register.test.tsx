import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from './register';

// Render test
it('renders RegisterScreen without crashing', () => {
  const { getByText } = render(<RegisterScreen />);
  expect(getByText('Register')).toBeTruthy();
});

// Interaction test
it('shows error on invalid registration', async () => {
  const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
  fireEvent.changeText(getByPlaceholderText('Email'), 'bad@email.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'short');
  fireEvent.press(getByText('Register'));
  await waitFor(() => {
    // Alert is mocked in test environment; check for error handling
    // TODO: mock supabase and assert error
  });
});
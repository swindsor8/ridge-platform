import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from './login';

// Render test
it('renders LoginScreen without crashing', () => {
  const { getByText } = render(<LoginScreen />);
  expect(getByText('Login')).toBeTruthy();
});

// Interaction test
it('shows error on invalid login', async () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  fireEvent.changeText(getByPlaceholderText('Email'), 'bad@email.com');
  fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
  fireEvent.press(getByText('Login'));
  await waitFor(() => {
    // Alert is mocked in test environment; check for error handling
    // TODO: mock supabase and assert error
  });
});
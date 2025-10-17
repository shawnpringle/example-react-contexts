import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './contexts/themeContext';
import { SessionProvider } from './contexts/sessionContext';
import { LanguageProvider } from './contexts/languageContext';
import BootstrapThemeProvider from 'react-bootstrap/ThemeProvider'
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BootstrapThemeProvider>  
    <ThemeProvider>
      <SessionProvider>
        <LanguageProvider>{ui}</LanguageProvider>
      </SessionProvider>
    </ThemeProvider>
    </BootstrapThemeProvider>
  );
}

test('renders learn react link', () => {
  renderWithProviders(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeTruthy();
});

test('cycles language when language button is clicked', () => {
  renderWithProviders(<App />);
  // initial language should be 'en' by default in test environment
  const langButton = screen.getByRole('button', { name: 'en' });
  expect(langButton).toBeTruthy();
  const langButtonInnerHTML = langButton.innerHTML;
  expect(langButtonInnerHTML).toBe('en');
  
  fireEvent.click(langButton);
  // next language should be 'es'
  const nextButton = screen.getByRole('button', { name: 'es' });
  expect(nextButton).toBeTruthy();
});

test('changes body background when theme button clicked', () => {
  const screen = renderWithProviders(<App />);
  const appHeaderEls = document.getElementsByClassName(`App-header`);
  
  expect(appHeaderEls.length).toBeGreaterThan(0);
  const appHeaderEl = appHeaderEls[0] as HTMLElement; 

   // default before theme applied
  expect(appHeaderEl.style.backgroundColor).toBe('#282c34');

  const darkBtn = screen.getByRole('button', { name: 'light' });
  expect(darkBtn).toBeTruthy();
  fireEvent.click(darkBtn);
  
  // ThemeProvider sets inline body style bg for immediate effect
  
  expect(appHeaderEl.style.backgroundColor).toBe('white');
});

test('renders filename inside a code element', () => {
  const { container } = renderWithProviders(<App />);
  const code = container.querySelector('code');
  expect(code).toBeTruthy();
  expect(code?.textContent).toContain('src/App.tsx');
});


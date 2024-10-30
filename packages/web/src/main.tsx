import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { ThemeProvider } from './components/theme-provider'
import { SearchFormProvider } from './components/search-form'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SearchFormProvider>
        <App />
      </SearchFormProvider>
    </ThemeProvider>
  </StrictMode>,
)

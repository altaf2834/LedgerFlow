import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
      />
    </AuthProvider>
  </BrowserRouter>
  </ErrorBoundary>
)

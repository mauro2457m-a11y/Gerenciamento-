import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to catch crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          fontFamily: 'system-ui, -apple-system, sans-serif', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f8fafc',
          color: '#334155',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1.5rem', color: '#ef4444' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
            Ops! Algo deu errado.
          </h1>
          <p style={{ marginBottom: '1.5rem', color: '#64748b', maxWidth: '400px' }}>
            Encontramos um erro inesperado. Tente recarregar a página ou verifique o console para mais detalhes.
          </p>
          {this.state.error && (
            <div style={{ 
              backgroundColor: '#f1f5f9', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1.5rem', 
              maxWidth: '600px',
              width: '100%',
              overflow: 'auto',
              textAlign: 'left',
              border: '1px solid #e2e8f0'
            }}>
              <code style={{ fontSize: '0.875rem', color: '#ef4444', fontFamily: 'monospace' }}>
                {this.state.error.toString()}
              </code>
            </div>
          )}
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }} 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
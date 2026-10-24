import React, { Component, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08070d] text-[#f0edf7] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#110e19] border border-[#2a2236] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#2e1420] border border-[#ff8fa3]/30 mx-auto flex items-center justify-center text-[#ff8fa3]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#f0edf7]">Console Recovery</h2>
            <p className="text-xs text-[#aaa4b8] leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred during interface initialization."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-2.5 px-4 rounded-xl bg-[#d6f588] text-[#08070d] font-bold text-xs uppercase tracking-wider font-mono hover:bg-[#c4e672] transition-colors"
            >
              Reload Console
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

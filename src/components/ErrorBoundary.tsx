import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info)
    // Wire to Sentry or similar here.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-sm px-4 py-16 text-center">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600">
            Please refresh the page. If this keeps happening, let us know.
          </p>
          <button
            onClick={() => window.location.assign('/')}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-white"
          >
            Back to home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

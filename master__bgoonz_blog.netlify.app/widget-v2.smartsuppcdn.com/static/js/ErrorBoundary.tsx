import React, { Component, ErrorInfo } from 'react'
import * as Sentry from '@sentry/browser'

class ErrorBoundary extends Component {
	state = { error: null }

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		this.setState({ error })
		Sentry.withScope(scope => {
			scope.setExtras(errorInfo)
			Sentry.captureException(error)
			console.error(error)
		})
	}

	render() {
		if (this.state.error) {
			return null
		}

		return this.props.children
	}
}

export default ErrorBoundary

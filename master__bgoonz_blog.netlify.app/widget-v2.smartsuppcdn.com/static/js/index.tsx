/** @jsx jsx */
import 'react-app-polyfill/ie11'
import 'core-js/features/array/includes'
import 'core-js/stable/array'
import 'regenerator-runtime/runtime'
import { jsx } from '@emotion/core'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { StylesProvider, createGenerateClassName } from '@material-ui/core'
import store from 'store'
import { GeneralAction } from 'store/general/actions'
import { getSsWidget } from 'utils/sdk'
import { mapApiCall } from 'utils/apiHelper'
import { fetchTranslations } from 'store/translations/actions'
import { iframeWrapperCss } from 'styles/iframeWrapperStyle'
import App from 'App'

// Is here to make sure the lazy loaded chunks are loaded correctly
// From the official documentation https://webpack.js.org/guides/public-path/#on-the-fly
// eslint-disable-next-line
declare let __webpack_public_path__: string | undefined
// eslint-disable-next-line
__webpack_public_path__ = `${getSsWidget().getBaseUrl()}/`

// Install API
getSsWidget().installApi({
	version: process.env.REACT_APP_VERSION || '',
	execute: (params: any[]) => {
		mapApiCall(params[0], params[1], ...params.slice(2))
	},
	// eslint-disable-next-line
	exec: function (...params: any) {
		this.execute(params)
	},
})

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
	Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN })
}

// Download translations
store.dispatch(fetchTranslations)
const generateClassName = createGenerateClassName({
	productionPrefix: 'smart-',
})

window.addEventListener('focus', () => {
	store.dispatch(GeneralAction.documentFocusToggle())
})
window.addEventListener('blur', () => {
	store.dispatch(GeneralAction.documentFocusToggle())
})

// Is here to simulate loader for positioning during development
const renderApp = () => (
	<Provider store={store}>
		<StylesProvider generateClassName={generateClassName}>
			<div css={iframeWrapperCss} className="app">
				<App />
			</div>
		</StylesProvider>
	</Provider>
)

ReactDOM.render(renderApp(), document.getElementById('root'))

/** @jsx jsx */
import React, { useEffect, Suspense, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Global, jsx } from '@emotion/core'
import { ThemeProvider } from 'emotion-theming'
import { Box } from '@material-ui/core'

import { WidgetButtonWrapper } from 'components/widgetButton/WidgetButtonWrapper'
import { registerTimeAgoLocale } from 'utils/timeAgoWrapper'
import { ButtonStyle } from 'model/ChatPosition'
import * as translationSelectors from 'store/translations/selectors'
import { generalSelectors } from 'store/general'
import { setFrameSize } from 'utils/iframeSizeHelper'
import { configGA } from 'utils/googleAnalytics'
import { widgetContainerPadding } from 'utils/paddingHelpers'
import { renderGlobalCssSettings } from 'styles/shared'
import ErrorBoundary from 'ErrorBoundary'
import { messageSelectors } from 'store/messages'
import { widgetOpenMaxHeight, widgetOpenMaxWidth } from 'constants/widgetSizeConstants'

const Chat = React.lazy(() => import('components/chat/Chat'))
const Trigger = React.lazy(() => import('components/trigger/Trigger'))

const smartsUppWindow = window.parent as any
// add property with the widget version to the global _smartsupp object
// can be read by `console.log(_smartsupp.widgetVersion)`
const _smartsupp = smartsUppWindow._smartsupp || {}
_smartsupp.widgetVersion = process.env.REACT_APP_VERSION || ''
smartsUppWindow._smartsupp = _smartsupp

configGA()
registerTimeAgoLocale()

const App = () => {
	const buttonStyle = useSelector(generalSelectors.isBubbleOrGreeting)
	const theme = useSelector(generalSelectors.theme)
	const isWidgetVisible = useSelector(generalSelectors.isWidgetVisible)
	const isWidgetMobile = useSelector(generalSelectors.isWidgetMobile)
	const isWidgetOpen = useSelector(generalSelectors.isWidgetOpen)
	const isTranslationFetching = useSelector(translationSelectors.isTranslationFetching)
	const showTrigger = useSelector(generalSelectors.showTrigger)
	const showTyping = useSelector(messageSelectors.showTriggerTypingAnimation)

	const triggerRef = useRef<HTMLDivElement>(null)
	const widgetButtonRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setFrameSize({
			isWidgetOpen,
			isWidgetMobile,
			showTrigger,
			isWidgetVisible,
			widerVersion: buttonStyle === ButtonStyle.Greeting,
			actualWidthOfWidget: widgetButtonRef.current?.clientWidth,
			actualHeightOfWidget: triggerRef.current?.clientHeight,
		})
	}, [isWidgetOpen, isWidgetMobile, showTrigger, buttonStyle, isWidgetVisible, showTyping])

	return (
		<ThemeProvider theme={theme}>
			<ErrorBoundary>
				<Global styles={renderGlobalCssSettings} />
				{isWidgetVisible && !isTranslationFetching && (
					<Box
						position="relative"
						overflow="hidden"
						height={isWidgetMobile ? '100%' : widgetOpenMaxHeight}
						width={isWidgetMobile ? '100%' : widgetOpenMaxWidth}
						maxHeight="100%"
						display="flex"
						flexDirection="column"
						boxSizing="border-box"
						padding={widgetContainerPadding(isWidgetMobile, isWidgetOpen)}
					>
						{showTrigger && (
							// TODO: discuss loader for lazy loading components for better UX experience
							<Suspense fallback={<div> &nbsp; </div>}>
								<Trigger reference={triggerRef} />
							</Suspense>
						)}
						{isWidgetOpen ? (
							// TODO: discuss loader for lazy loading components for better UX experience
							<Suspense fallback={<div> &nbsp; </div>}>
								<Chat />
							</Suspense>
						) : (
							<WidgetButtonWrapper widgetButtonRef={widgetButtonRef} />
						)}
					</Box>
				)}
			</ErrorBoundary>
		</ThemeProvider>
	)
}

export default App

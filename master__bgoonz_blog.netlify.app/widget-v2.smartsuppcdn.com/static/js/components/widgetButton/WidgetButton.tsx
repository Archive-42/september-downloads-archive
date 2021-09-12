import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { css } from '@emotion/core'
import { Box } from '@material-ui/core'

import { ChatOrientation } from 'model/ChatPosition'
import { generalSelectors } from 'store/general'
import { TranslationService as T } from 'utils/TranslationService'
import { getFromStorage } from 'utils/cookie'
import { recalculateFrameWidth } from 'utils/iframeSizeHelper'
import { chatPosition } from 'constants/apiConstants'
import { showWidgetButtonAnimationName } from 'constants/cookies'
import { SSPX } from 'constants/themeConstants'

import {
	WIDGET_BUTTON_WRAPPER_ANIMATION_TIME,
	WIDGET_BUTTON_WRAPPER_ANIMATION_DELAY,
	WIDGET_BUTTON_TEXT_ANIMATION_TIME,
	WIDGET_BUTTON_TEXT_ANIMATION_DELAY,
} from 'constants/timeoutConstants'
import {
	appearFromSideAnimation,
	appearFromSideAnimationWrapper,
	appearFromSideAnimationFinish,
	appearFromSideAnimationTextFinish,
} from 'styles/animations/animations'

import WidgetBubble from './WidgetBubble'

const WIDGET_BUTTON_MOBILE_FONT_SIZE = '14px'
const WIDGET_BUTTON_FONT_SIZE = '16px'

interface Props {
	widgetButtonRef: React.RefObject<HTMLDivElement>
}

const WidgetButton = ({ widgetButtonRef }: Props) => {
	const isWidgetMobile = useSelector(generalSelectors.isWidgetMobile)
	const showAnimation = !getFromStorage(showWidgetButtonAnimationName)

	useEffect(() => {
		recalculateFrameWidth(widgetButtonRef.current?.clientWidth)
	}, [widgetButtonRef])

	return (
		<Box display="flex" flexDirection="row" className="wrapper" borderRadius={32} boxShadow={3}>
			{chatPosition === ChatOrientation.Left && <WidgetBubble />}
			<Box display="flex" alignItems="center" css={buttonAnimationCss(showAnimation)}>
				<div
					ref={widgetButtonRef}
					style={{
						paddingLeft: chatPosition === ChatOrientation.Right ? 2 * SSPX : 0,
						paddingRight: chatPosition === ChatOrientation.Left ? 2 * SSPX : 0,
					}}
				>
					<Box
						css={textAnimationCss(chatPosition, showAnimation)}
						fontSize={isWidgetMobile ? WIDGET_BUTTON_MOBILE_FONT_SIZE : WIDGET_BUTTON_FONT_SIZE}
						letterSpacing="-0.2px"
						maxWidth={120}
					>
						{T.translate('button.greeting')}
					</Box>
				</div>
			</Box>
			{chatPosition === ChatOrientation.Right && <WidgetBubble />}
		</Box>
	)
}

export default WidgetButton

const buttonAnimationCss = (showAnimation: boolean) => css`
	${showAnimation
		? css`
				animation: ${appearFromSideAnimationWrapper()} ${WIDGET_BUTTON_WRAPPER_ANIMATION_TIME}ms ease-in-out both
					${WIDGET_BUTTON_WRAPPER_ANIMATION_DELAY}ms !important;
		  `
		: css`
				${appearFromSideAnimationFinish()}
		  `}
	will-change: transform;
	transition: width 1s ease-in-out;
`

const textAnimationCss = (orientation: ChatOrientation, showAnimation: boolean) => css`
	transition: transform 300ms linear;
	${
		showAnimation
			? css`
					animation: ${appearFromSideAnimation(orientation === ChatOrientation.Left)}
						${WIDGET_BUTTON_TEXT_ANIMATION_TIME}ms ease-in-out both ${WIDGET_BUTTON_TEXT_ANIMATION_DELAY}ms;
			  `
			: css`
					${{ ...appearFromSideAnimationTextFinish }}
			  `
	}};
`

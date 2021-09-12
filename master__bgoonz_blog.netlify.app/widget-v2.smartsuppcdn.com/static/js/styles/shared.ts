import css from '@emotion/css'
import { SSPX } from '../constants/themeConstants'
import { smartColors } from './colors'
import { MAIN_FONT_FAMILY } from '../constants/textConstants'

export const closeButtonWrapperCss = css`
	padding-top: ${2 * SSPX}px;
`

export const closeButtonCss = css`
	color: ${smartColors.darkerGrey};
`

export const closeIconSmallCss = css`
	padding: 0px !important;
`

export const WIDGET_PADDING_WHOLE = 5

export const renderGlobalCssSettings = css`
	.app {
		font-family: ${MAIN_FONT_FAMILY};
		height: 100%;
	}
	.emoji {
		width: 18px;
		height: 18px;
		margin-bottom: -3px;
		margin-left: 3px;
		margin-right: 3px;
	}
	.material-icons {
		font-weight: normal;
		font-style: normal;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-feature-settings: 'liga';
		-webkit-font-smoothing: antialiased;
	}
	:-ms-input-placeholder {
		opacity: 0.5 !important;
		color: ${smartColors.grey};
	}
	div[id^='__lpform_'] {
		display: none;
	}
	html {
		-webkit-backface-visibility: hidden;
		-webkit-font-smoothing: antialiased; // is here for Safari flickering
	}

	#chat-application {
		user-select: none !important;
	}
`

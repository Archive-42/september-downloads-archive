import { createStyles, BadgeOrigin } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { smartColors } from './colors'
import { ChatOrientation } from '../model/ChatPosition'

export const useBadgeStyles = makeStyles(
	() =>
		createStyles({
			unreadMessagesBadge: {
				top: '9px !important',
				right: '9px !important',
				background: `${smartColors.red} !important`,
				color: 'white',
				boxShadow: '1px 1px 2px rgba(0,0,0,0.4) !important',
			},
			onlineBadge: {
				padding: '6px',
				borderRadius: '50%',
				background: `${smartColors.green} !important`,
				border: '2px solid white',
				'&.MuiBadge-anchorOriginTopLeftCircle': {
					left: '10px',
				},
				'&.MuiBadge-anchorOriginTopRightCircle': {
					right: '10px',
				},
				'&.MuiBadge-anchorOriginBottomLeftCircle': {
					left: '55px',
					bottom: '15px',
				},
			},
		}),
	{ name: 'SmartBadge' },
)

export const anchorOriginPosition = (
	isButtonStyleGreeting: boolean,
	chatPosition: ChatOrientation,
	isWidgetMobile: boolean,
): BadgeOrigin => {
	if (isButtonStyleGreeting) {
		return {
			vertical: 'top',
			horizontal: chatPosition === 'left' ? 'right' : 'left',
		}
	}
	if (isWidgetMobile) {
		return {
			vertical: 'bottom',
			horizontal: 'right',
		}
	}
	return {
		vertical: 'bottom',
		horizontal: 'left',
	}
}

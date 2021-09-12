/** @jsx jsx */
import { useSelector } from 'react-redux'
import { Badge, Box, Fab } from '@material-ui/core'
import { jsx, css } from '@emotion/core'

import { ButtonStyle } from 'model/ChatPosition'
import { generalSelectors } from 'store/general'
import { messageSelectors } from 'store/messages'
import { scaleUpAnimation } from 'styles/animations/animations'
import { useBadgeStyles } from 'styles/badgeStyle'
import { widgetButtonBiggerSize, widgetButtonSmallSize } from 'constants/widgetSizeConstants'

import { MessageIcon } from 'components/customIcons'

const WidgetBubble = () => {
	const unreadCount = useSelector(messageSelectors.unreadMessagesCount)
	const isWidgetMobile = useSelector(generalSelectors.isWidgetMobile)
	const isBubbleOrGreeting = useSelector(generalSelectors.isBubbleOrGreeting)
	const classes = useBadgeStyles({})

	const isButtonStyleGreeting = isBubbleOrGreeting === ButtonStyle.Greeting

	const unreadMessagesBadgeStyle = {
		badge: classes.unreadMessagesBadge,
	}

	return (
		<Box p={0.5}>
			<Badge badgeContent={unreadCount} classes={unreadMessagesBadgeStyle} data-testid="widgetButtonBadge">
				<Fab
					data-testid="widgetButton"
					css={[fabButtonCss(isButtonStyleGreeting, isWidgetMobile), messageIconCss]}
					variant="round"
					aria-label="Chat"
					className="fab"
					disableRipple
				>
					<MessageIcon data-testid="widgetButtonClose" fontSizeAdjust={22} transform="scale(-1,1)" />
				</Fab>
			</Badge>
		</Box>
	)
}

export default WidgetBubble

const fabButtonCss = (widerVersion: boolean, isWidgetMobile: boolean) =>
	css({
		height: `${widerVersion || isWidgetMobile ? widgetButtonSmallSize : widgetButtonBiggerSize} !important`,
		width: `${widerVersion || isWidgetMobile ? widgetButtonSmallSize : widgetButtonBiggerSize} !important`,
		background: widerVersion ? 'rgba(255, 255, 255, 0.1) !important' : undefined,
	})

const messageIconCss = css({
	animation: `${scaleUpAnimation} 350ms cubic-bezier(0.165, 0.84, 0.44, 1) !important`,
	willChange: 'transform',
	boxShadow: 'none !important',
})

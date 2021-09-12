import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Box, darken } from '@material-ui/core'
import { AccountStatus } from '@smartsupp/websocket-client'

import { ButtonStyle, ChatOrientation } from 'model/ChatPosition'
import { generalSelectors } from 'store/general'
import { toggleOpenCloseWidget } from 'store/general/actions'
import { agentsSelectors } from 'store/agent/index'
import { chatPosition } from 'constants/apiConstants'
import styled from 'styles/styled'
import { useBadgeStyles, anchorOriginPosition } from 'styles/badgeStyle'

import WidgetBubble from './WidgetBubble'
import WidgetButton from './WidgetButton'

type Props = {
	className?: string
	widgetButtonRef: React.RefObject<HTMLDivElement>
}

const Widget = ({ className, widgetButtonRef }: Props) => {
	const isWidgetMobile = useSelector(generalSelectors.isWidgetMobile)
	const isBubbleOrGreeting = useSelector(generalSelectors.isBubbleOrGreeting)
	const agentStatus = useSelector(agentsSelectors.status)
	const dispatch = useDispatch()
	const classes = useBadgeStyles({})

	const handleOpenCloseWidgetToggle = () => dispatch(toggleOpenCloseWidget(true))

	const isButtonStyleGreeting = isBubbleOrGreeting === ButtonStyle.Greeting

	const onlineBadgeStyle = {
		badge: classes.onlineBadge,
	}

	return (
		<Box
			data-testid="widgetButtonWrapper"
			className={className}
			display="flex"
			position="absolute"
			bottom={5}
			right={chatPosition === ChatOrientation.Right ? 5 : undefined}
			left={chatPosition === ChatOrientation.Left ? 5 : undefined}
			onClick={handleOpenCloseWidgetToggle}
		>
			<Badge
				classes={onlineBadgeStyle}
				invisible={agentStatus === AccountStatus.Offline}
				overlap="circle"
				variant="dot"
				anchorOrigin={anchorOriginPosition(isButtonStyleGreeting, chatPosition, isWidgetMobile)}
			>
				{isButtonStyleGreeting ? <WidgetButton widgetButtonRef={widgetButtonRef} /> : <WidgetBubble />}
			</Badge>
		</Box>
	)
}

const DARKEN_COEFFICIENT = 0.1

export const WidgetButtonWrapper = styled(Widget)`
	.wrapper {
		color: ${props => props.theme.textColor};
		width: auto;
		background-image: linear-gradient(80deg, ${props => props.theme.primary}, ${props => props.theme.light});
		&:hover {
			cursor: pointer;
			background-image: linear-gradient(
				80deg,
				${props => darken(props.theme.primary, DARKEN_COEFFICIENT)},
				${props => darken(props.theme.light, DARKEN_COEFFICIENT)}
			);
		}
	}

	.fab {
		color: ${props => props.theme.textColor} !important;
		background-image: linear-gradient(80deg, ${props => props.theme.primary}, ${props => props.theme.light});
		&:hover {
			background-image: linear-gradient(
				80deg,
				${props => darken(props.theme.primary, DARKEN_COEFFICIENT)},
				${props => darken(props.theme.light, DARKEN_COEFFICIENT)}
			);
		}
	}
`

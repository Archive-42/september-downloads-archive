import React from 'react'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import css from '@emotion/css'

export const SmileyIcon = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 64 64" css={smileyIconCss}>
		<path d="M32 0a32 32 0 1 0 32 32A32 32 0 0 0 32 0zm0 59.24A27.24 27.24 0 1 1 59.24 32 27.23 27.23 0 0 1 32 59.24z" />
		<path d="M40.53 40.7a1.63 1.63 0 0 0-1.14.53 10 10 0 0 1-14.07.71 9.51 9.51 0 0 1-.71-.71 1.65 1.65 0 1 0-2.45 2.2 13.26 13.26 0 0 0 18.72 1c.34-.31.66-.63 1-1a1.66 1.66 0 0 0-.14-2.33 1.59 1.59 0 0 0-1.21-.4z" />
		<circle cx="21.17" cy="25.5" r="2.75" data-name="Ellipse 74" />
		<circle cx="42.83" cy="25.5" r="2.75" data-name="Ellipse 75" />
	</SvgIcon>
)

const smileyIconCss = css`
	padding: 0 3px;
`

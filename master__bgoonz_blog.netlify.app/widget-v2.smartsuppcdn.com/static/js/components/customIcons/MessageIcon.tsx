import React from 'react'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import css from '@emotion/css'
import { SSPX } from '../../constants/themeConstants'

export const MessageIcon = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 64 64" css={messageIconCss}>
		<path d="M.86 18.51v-.16C3.65 7.05 19.39 3 32 3s28.39 4 31.18 15.5a66.22 66.22 0 0 1 0 20.46C62 43.7 58.13 47.59 51.82 50.37l4 5A3.47 3.47 0 0 1 53.09 61a3.39 3.39 0 0 1-1.44-.31L37.11 54c-1.79.18-3.49.27-5.07.27C21 54.31 3.63 50.23.86 38.84a60.33 60.33 0 0 1 0-20.33z" />
	</SvgIcon>
)

const messageIconCss = css`
	padding: 0 ${0.5 * SSPX}px;
	box-shadow: none !important;
`

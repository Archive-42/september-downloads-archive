/** @jsx jsx */
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import { jsx, css } from '@emotion/core'

export const AttachmentIcon = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 64 64" css={attachmentIconCss}>
		<path d="M30.59 28.55a2.26 2.26 0 0 0-3.2-3.2l-12 11.94a10.67 10.67 0 0 0 15.14 15.09l27-27a14.89 14.89 0 1 0-21.09-21L9.49 31.31a19.15 19.15 0 1 0 27.1 27.07l11.94-11.94a2.26 2.26 0 0 0-3.2-3.2L33.39 55.18a14.64 14.64 0 0 1-21.06-20.34l.36-.35L39.62 7.56a10.26 10.26 0 0 1 7.32-3 10.4 10.4 0 0 1 7.32 3 10.26 10.26 0 0 1 3 7.32 10.39 10.39 0 0 1-3 7.32l-27 27a6.21 6.21 0 0 1-8.7 0 6.12 6.12 0 0 1 0-8.65l12-11.95z" />
	</SvgIcon>
)

const attachmentIconCss = css`
	padding: 0px !important;
`

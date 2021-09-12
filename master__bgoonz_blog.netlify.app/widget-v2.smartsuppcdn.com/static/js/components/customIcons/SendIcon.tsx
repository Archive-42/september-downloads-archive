import React, { useMemo } from 'react'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'

type Props = {
	customFontSize?: number
} & SvgIconProps
export const SendIcon = ({ customFontSize, ...otherProps }: Props) => {
	const iconStyle = useMemo(
		() => ({
			fontSize: customFontSize || 'default',
		}),
		[customFontSize],
	)
	return (
		<SvgIcon {...otherProps} viewBox="0 0 64 64" style={iconStyle}>
			<path d="M7.47,62.62c-3.85,2-6.2.24-5.24-4L6.29,40.53a6,6,0,0,1,4.79-4.33l24.41-2.84c6.5-.74,6.52-2,0-2.71l-24.4-2.79A5.89,5.89,0,0,1,6.3,23.58L2.22,5.33c-1-4.23,1.38-6,5.24-3.95L58.11,28.29c3.85,2.05,3.86,5.36,0,7.41L7.46,62.62Z" />
		</SvgIcon>
	)
}

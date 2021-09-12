import React from 'react'
import { SvgIcon } from '@material-ui/core'
import { SvgIconProps } from '@material-ui/core/SvgIcon'

export const EmojiHappy = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 64 64">
		<g>
			<circle style={{ fill: '#69d622' }} cx="32" cy="32" r="32" />
			<g>
				<path
					style={{ fill: '#3d7c28' }}
					d="M20.26,40.74A1.4222,1.4222,0,1,0,18.14,42.6375a18.6665,18.6665,0,0,0,27.7192,0A1.4222,1.4222,0,1,0,43.74,40.74a15.8223,15.8223,0,0,1-23.4808,0Z"
				/>
				<circle style={{ fill: '#3d7c28' }} cx="20.8" cy="24.8" r="4" />
				<circle style={{ fill: '#3d7c28' }} cx="43.2" cy="24.8" r="4" />
				<g>
					<circle style={{ fill: '#fff' }} cx="42.7638" cy="25.7674" r="6.7638" />
					<path
						style={{ fill: '#323e48' }}
						d="M42.5633,21.3568a3.31,3.31,0,0,0-1.3471.2868A1.5232,1.5232,0,1,1,39.45,23.5253a3.3208,3.3208,0,1,0,3.1129-2.1685Z"
					/>
				</g>
				<g>
					<circle style={{ fill: '#fff' }} cx="20.7638" cy="25.7674" r="6.7638" />
					<path
						style={{ fill: '#323e48' }}
						d="M20.5633,21.3568a3.31,3.31,0,0,0-1.3471.2868A1.5232,1.5232,0,1,1,17.45,23.5253a3.3208,3.3208,0,1,0,3.1129-2.1685Z"
					/>
				</g>
			</g>
		</g>
	</SvgIcon>
)

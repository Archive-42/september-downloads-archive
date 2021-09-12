import React from 'react'
import { SvgIcon } from '@material-ui/core'
import { SvgIconProps } from '@material-ui/core/SvgIcon'

export const EmojiNeutral = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 64 64">
		<g>
			<circle style={{ fill: '#efd739' }} cx="32" cy="32" r="32" />
			<g>
				<path
					style={{ fill: '#af6e0e' }}
					d="M40.1469,46.8344l-15.8341,2.298a1.6,1.6,0,1,1-.46-3.1668l15.8341-2.298a1.6,1.6,0,1,1,.46,3.1668Z"
				/>
				<circle style={{ fill: '#af6e0e' }} cx="20.8" cy="24.8" r="4" />
				<circle style={{ fill: '#af6e0e' }} cx="43.2" cy="24.8" r="4" />
				<g>
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
		</g>
	</SvgIcon>
)

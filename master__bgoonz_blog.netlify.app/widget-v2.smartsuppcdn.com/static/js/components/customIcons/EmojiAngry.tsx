import React from 'react'
import { SvgIcon } from '@material-ui/core'
import { SvgIconProps } from '@material-ui/core/SvgIcon'

export const EmojiAngry = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 64 64">
		<g>
			<circle style={{ fill: '#ee5f54' }} cx="32" cy="32" r="32" />
			<path
				style={{ fill: '#9b241e' }}
				d="M43.74,48.3263a1.4221,1.4221,0,0,0,2.1191-1.8972,18.6664,18.6664,0,0,0-27.7191,0,1.4221,1.4221,0,0,0,2.1191,1.8972,15.8224,15.8224,0,0,1,23.4809,0Z"
			/>
			<circle cx="20.8" cy="24.8" r="4" />
			<circle style={{ fill: '#9b241e' }} cx="43.2" cy="24.8" r="4" />
			<g>
				<g>
					<path
						style={{ fill: '#fff' }}
						d="M42.7638,20c3.7355,0,6.7638,2.0319,6.7638,5.7674a6.7638,6.7638,0,1,1-13.5276,0C36,22.0319,39.0283,20,42.7638,20Z"
					/>
					<path
						style={{ fill: '#323e48' }}
						d="M42.5633,21.3568a3.31,3.31,0,0,0-1.3471.2868A1.5232,1.5232,0,1,1,39.45,23.5253a3.3208,3.3208,0,1,0,3.1129-2.1685Z"
					/>
				</g>
				<g>
					<path
						style={{ fill: '#fff' }}
						d="M20.7638,20c3.7355,0,6.7638,2.0319,6.7638,5.7674a6.7638,6.7638,0,0,1-13.5276,0C14,22.0319,17.0283,20,20.7638,20Z"
					/>
					<path
						style={{ fill: '#323e48' }}
						d="M20.5633,21.3568a3.31,3.31,0,0,0-1.3471.2868A1.5232,1.5232,0,1,1,17.45,23.5253a3.3208,3.3208,0,1,0,3.1129-2.1685Z"
					/>
				</g>
			</g>
			<rect style={{ fill: '#9b241e' }} x="12" y="20" width="15" height="3" rx="1.5" />
			<rect style={{ fill: '#9b241e' }} x="37" y="20" width="15" height="3" rx="1.5" />
		</g>
	</SvgIcon>
)

import Color from 'color'
import { getSsWidget } from 'utils/sdk'
import { FALLBACK_PRIMARY_COLOR } from 'constants/themeConstants'
import { SmartTheme } from 'model/Theme'
import { smartColors } from 'styles/colors'

const ssTheme: string = getSsWidget().options?.color ?? FALLBACK_PRIMARY_COLOR

const RED_MULTIPLIER = 0.299
const GREEN_MULTIPLIER = 0.587
const BLUE_MULTIPLIER = 0.114
const HALF_DEGREES = 180

export const detectLight = (color: Color<string>): boolean => {
	const rgb = color.rgb().array()
	const red = rgb[0]
	const green = rgb[1]
	const blue = rgb[2]

	return (
		Math.sqrt(RED_MULTIPLIER * (red * red) + GREEN_MULTIPLIER * (green * green) + BLUE_MULTIPLIER * (blue * blue)) <
		HALF_DEGREES
	)
}

export const generateTheme = (clr = ssTheme): SmartTheme => {
	const color = Color(clr)
	const isDark = detectLight(color)

	const primary = color.hex()
	const light = color.rotate(-15).saturate(-0.25).lighten(0.2).hex()
	const dark = color.rotate(0).saturate(0.03).darken(0.5).hex()
	const themeColorContrast = isDark ? 'white' : dark
	const textColor = isDark ? 'white' : smartColors.inputText
	const lightVariant = isDark ? light : primary
	const darkVariant = isDark ? primary : dark

	return {
		primary,
		light,
		dark,
		isDark,
		themeColorContrast,
		textColor,
		lightVariant,
		darkVariant,
	}
}

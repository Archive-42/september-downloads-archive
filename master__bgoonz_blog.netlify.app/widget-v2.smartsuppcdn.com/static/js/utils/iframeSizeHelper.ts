import { ChatOrientation, ChatPosition } from 'model/ChatPosition'
import { getSsWidget } from 'utils/sdk'
import { setParentStyle } from 'utils/styleChanger'
import {
	offsetXDefault,
	offsetYDefault,
	widgetClosedHeight,
	widgetClosedWidth,
	widgetClosedMobileHeight,
	widgetClosedMobileWidth,
	widgetClosedWithTriggerHeight,
	widgetClosedWidthWiderVersion,
	widgetClosedWithTriggerWidth,
	widgetButtonBiggerSizeNumber,
	widgetShadowSizeNumber,
	bottomTriggerDistanceMultiplier,
	widgetOpenHeight,
	widgetOpenMaxHeight,
	widgetOpenMaxWidth,
	widgetOpenMobileHeight,
} from 'constants/widgetSizeConstants'
import { WHOLE_CHAT_Z_INDEX } from 'constants/zIndexConstants'
import { SSPX } from 'constants/themeConstants'

interface SizeMap {
	showTrigger: boolean
	moreEngagementBtn: boolean
	size: string
}

interface OffsetBasic {
	isWidgetMobile: boolean
	isWidgetOpen: boolean
}

interface OffsetHelperGeneric extends OffsetBasic {
	offsetMobile: number
	offsetDesktop: number
}

interface OffsetHelperSpecific extends OffsetBasic {
	offset?: number
}

interface FrameSize {
	isWidgetOpen: boolean
	isWidgetMobile: boolean
	showTrigger: boolean
	isWidgetVisible?: boolean
	widerVersion: boolean
	actualWidthOfWidget?: number
	actualHeightOfWidget?: number
}

interface IframeSizeHelper {
	showTrigger: boolean
	widerVersion: boolean
}

interface IframeHeightHelper extends IframeSizeHelper {
	actualHeightOfWidget: number
}

interface IframeWidthHelper extends IframeSizeHelper {
	actualWidthOfWidget: number
}

const heightMap: SizeMap[] = [
	{
		showTrigger: true,
		moreEngagementBtn: true,
		size: widgetClosedWithTriggerHeight,
	},
	{
		showTrigger: false,
		moreEngagementBtn: true,
		size: widgetClosedHeight,
	},
	{
		showTrigger: true,
		moreEngagementBtn: false,
		size: widgetClosedWithTriggerHeight,
	},
	{
		showTrigger: false,
		moreEngagementBtn: false,
		size: widgetClosedWidth,
	},
]

const widthMap: SizeMap[] = [
	{
		showTrigger: true,
		moreEngagementBtn: true,
		size: widgetClosedWithTriggerWidth,
	},
	{
		showTrigger: false,
		moreEngagementBtn: true,
		size: widgetClosedWidthWiderVersion,
	},
	{
		showTrigger: true,
		moreEngagementBtn: false,
		size: widgetClosedWithTriggerWidth,
	},
	{
		showTrigger: false,
		moreEngagementBtn: false,
		size: widgetClosedWidth,
	},
]

const mapHelper = (showTrigger: boolean, moreEngagementBtn: boolean, map: SizeMap[]): string => {
	const foundHeight = map.find(h => h.showTrigger === showTrigger && h.moreEngagementBtn === moreEngagementBtn)

	if (foundHeight) {
		return foundHeight.size
	}
	return widgetClosedHeight
}

const hasWidgetCustomHeight = (showTrigger: boolean, actualHeightOfWidget: number): boolean =>
	actualHeightOfWidget !== 0 && actualHeightOfWidget > widgetButtonBiggerSizeNumber && showTrigger

export const iframeWidthHelper = ({ showTrigger, widerVersion, actualWidthOfWidget }: IframeWidthHelper): string => {
	if (actualWidthOfWidget !== 0 && !showTrigger && widerVersion) {
		return `${actualWidthOfWidget + widgetShadowSizeNumber + widgetButtonBiggerSizeNumber}px`
	}

	return mapHelper(showTrigger, widerVersion, widthMap)
}
export const iframeHeightHelper = ({ showTrigger, widerVersion, actualHeightOfWidget }: IframeHeightHelper): string => {
	if (hasWidgetCustomHeight(showTrigger, actualHeightOfWidget)) {
		return `${actualHeightOfWidget + widgetShadowSizeNumber + bottomTriggerDistanceMultiplier * SSPX}px`
	}
	return mapHelper(showTrigger, widerVersion, heightMap)
}

const offsetSideHelper = ({ isWidgetMobile, isWidgetOpen, offset }: OffsetHelperSpecific): string => {
	const offsetMobile = offset ?? 0.75 * SSPX
	const offsetDesktop = !isWidgetOpen && offset ? offset : offsetXDefault

	return offsetHelper({ isWidgetMobile, isWidgetOpen, offsetMobile, offsetDesktop })
}

const offsetBottomHelper = ({ isWidgetMobile, isWidgetOpen, offset }: OffsetHelperSpecific): string => {
	const offsetMobile = offset ?? SSPX
	const offsetDesktop = !isWidgetOpen && offset ? offset : offsetYDefault

	return offsetHelper({ isWidgetMobile, isWidgetOpen, offsetMobile, offsetDesktop })
}

const offsetHelper = ({ isWidgetMobile, isWidgetOpen, offsetMobile, offsetDesktop }: OffsetHelperGeneric): string => {
	if (isWidgetMobile) {
		if (isWidgetOpen) {
			return '0px'
		}
		return `${offsetMobile}px`
	}
	return `${offsetDesktop}px`
}
export const setFrameSize = ({
	isWidgetOpen,
	isWidgetMobile,
	showTrigger,
	isWidgetVisible,
	widerVersion = false,
	actualWidthOfWidget = 0,
	actualHeightOfWidget = 0,
}: FrameSize): void => {
	const div = getSsWidget().el
	const { orientation, position, offsetX, offsetY } = getSsWidget().options

	if (!div) {
		return
	}
	if (!isWidgetVisible) {
		div.style.display = 'none'
		return
	}

	setParentStyle(isWidgetOpen && isWidgetMobile)

	const offsetFromSide = offsetSideHelper({ isWidgetMobile, isWidgetOpen, offset: offsetX })
	const offsetFromBottom = offsetBottomHelper({ isWidgetMobile, isWidgetOpen, offset: offsetY })

	div.style.display = 'block'
	div.style.overflow = 'hidden'
	div.style.zIndex = `${WHOLE_CHAT_Z_INDEX}`

	if (position === ChatPosition.Fixed) {
		div.style.position = 'fixed'
		div.style.bottom = offsetFromBottom
		if (orientation) {
			if (orientation === ChatOrientation.Right) {
				div.style.left = 'initial'
				div.style.right = offsetFromSide
			} else {
				div.style.left = offsetFromSide
				div.style.right = 'initial'
			}
		}
	}

	if (isWidgetMobile) {
		if (isWidgetOpen) {
			div.style.height = widgetOpenMobileHeight
			div.style.maxHeight = widgetOpenMobileHeight
			div.style.height = '100%'
			div.style.maxWidth = '100%'
			div.style.width = '100%'
			div.style.background = 'white'
		} else {
			div.style.maxHeight = widgetClosedMobileHeight
			div.style.maxWidth = widerVersion ? widgetClosedWidthWiderVersion : widgetClosedMobileWidth
			div.style.height = widgetClosedMobileHeight
			div.style.width = widerVersion ? widgetClosedWidthWiderVersion : widgetClosedMobileWidth
			div.style.background = 'transparent'
		}
	} else if (isWidgetOpen) {
		div.style.maxHeight = widgetOpenMaxHeight
		div.style.height = widgetOpenHeight
		div.style.maxWidth = widgetOpenMaxWidth
		div.style.width = widgetOpenMaxWidth
		div.style.background = 'transparent'
	} else {
		div.style.maxHeight = iframeHeightHelper({ showTrigger, widerVersion, actualHeightOfWidget })
		div.style.maxWidth = iframeWidthHelper({ showTrigger, widerVersion, actualWidthOfWidget })
		div.style.height = iframeHeightHelper({ showTrigger, widerVersion, actualHeightOfWidget })
		div.style.width = iframeWidthHelper({ showTrigger, widerVersion, actualWidthOfWidget })
		div.style.background = 'transparent'
	}
}

export const recalculateFrameWidth = (actualWidthOfWidget = 0): void => {
	const div = getSsWidget().el

	if (!div) {
		return
	}

	div.style.maxWidth = iframeWidthHelper({ showTrigger: false, widerVersion: true, actualWidthOfWidget })
	div.style.width = iframeWidthHelper({ showTrigger: false, widerVersion: true, actualWidthOfWidget })
}

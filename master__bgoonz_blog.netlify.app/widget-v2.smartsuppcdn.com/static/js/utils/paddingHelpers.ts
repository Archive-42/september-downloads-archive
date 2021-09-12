import { WIDGET_PADDING_WHOLE } from '../styles/shared'

const widgetPadding = [
	{
		isWidgetMobile: false,
		isWidgetOpen: true,
		padding: `${WIDGET_PADDING_WHOLE}px`,
	},
	{
		isWidgetMobile: false,
		isWidgetOpen: false,
		padding: `${WIDGET_PADDING_WHOLE}px`,
	},
	{
		isWidgetMobile: true,
		isWidgetOpen: true,
		padding: `0px`,
	},
	{
		isWidgetMobile: true,
		isWidgetOpen: false,
		padding: `0px 0px ${WIDGET_PADDING_WHOLE}px 0px !important`,
	},
]

export const widgetContainerPadding = (isWidgetMobile: boolean, isWidgetOpen: boolean) => {
	const padding = widgetPadding.find(p => p.isWidgetMobile === isWidgetMobile && p.isWidgetOpen === isWidgetOpen)
	return padding!.padding
}

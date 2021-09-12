import { secretDebug } from './debug'

interface ElementAndStyle {
	getElementStyle: (doc: Document) => CSSStyleDeclaration
	newStyle: Partial<CSSStyleDeclaration>
	prevStyle: Partial<CSSStyleDeclaration>
}

export const elements: ElementAndStyle[] = [
	{
		getElementStyle: (doc: Document) => doc.body.style,
		newStyle: {
			overflow: 'hidden',
			position: 'fixed',
			top: '0',
			left: '0',
			bottom: '0',
			right: '0',
		},
		prevStyle: {},
	},
	{
		getElementStyle: (doc: Document) => doc.documentElement.style,
		newStyle: {
			overflow: 'hidden',
			margin: '0px',
		},
		prevStyle: {},
	},
]

let prevValue = false
let prevY = 0

// This method changes the parent style when mobile widget opened, otherwise it changes it back to its original values
export const setParentStyle = (
	isMobileWidgetOpened: boolean,
	elementsToChange = elements,
	prevIsMobileWidgetOpened = prevValue,
) => {
	if (isMobileWidgetOpened !== prevIsMobileWidgetOpened) {
		if (isMobileWidgetOpened) {
			prevY = window.top.pageYOffset
			secretDebug('prevY', prevY)
		}

		elementsToChange.forEach(elementToChange => {
			const domElement = elementToChange.getElementStyle(window.top.document)

			if (isMobileWidgetOpened) {
				elementToChange.prevStyle = Object.keys(elementToChange.newStyle).reduce(
					(value, key) =>
						Object.assign(value, {
							// eslint-disable-next-line
							// @ts-ignore
							[key]: domElement[key],
						}),
					{},
				)

				Object.keys(elementToChange.newStyle).forEach(key => {
					// eslint-disable-next-line
					// @ts-ignore
					domElement[key] = elementToChange.newStyle[key]
				})
			} else {
				Object.keys(elementToChange.newStyle).forEach(key => {
					// eslint-disable-next-line
					// @ts-ignore
					domElement[key] = elementToChange.prevStyle[key]
				})
				secretDebug('scrollTo', window.top, prevY)

				window.top.scrollTo({
					top: prevY,
				})
			}
		})
		prevValue = isMobileWidgetOpened
	}
}

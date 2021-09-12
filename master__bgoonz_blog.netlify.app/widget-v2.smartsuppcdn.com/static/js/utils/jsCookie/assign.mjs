/* eslint-disable no-plusplus */
/* eslint-disable prefer-rest-params */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export default function (target) {
	for (let i = 1; i < arguments.length; i++) {
		const source = arguments[i]
		for (const key in source) {
			target[key] = source[key]
		}
	}
	return target
}

export const promiseTimeout = (ms: number, promise: Promise<any>) => {
	// Create a promise that rejects in <ms> milliseconds
	const timeout = new Promise((resolve, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id)
			// eslint-disable-next-line
			reject(`Timed out in ${ms}ms.`)
		}, ms)
	})

	// Returns a race between our timeout and the passed in promise
	return Promise.race([promise, timeout])
}

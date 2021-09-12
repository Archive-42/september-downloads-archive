function createPubSub() {
	const subscribers: any = {}
	function publish(eventName: string, data: any) {
		if (!Array.isArray(subscribers[eventName])) {
			return
		}
		subscribers[eventName].forEach((callback: (params: any) => void) => {
			callback(data)
		})
	}
	function subscribe(eventName: string, callback: (params: any) => void) {
		if (!Array.isArray(subscribers[eventName])) {
			subscribers[eventName] = []
		}
		subscribers[eventName].push(callback)
	}
	return {
		publish,
		subscribe,
	}
}

export const pubSub = createPubSub()

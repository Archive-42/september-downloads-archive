export default {
	read(value) {
		return value.replace(/%3B/g, ';')
	},
	write(value) {
		return value.replace(/;/g, '%3B')
	},
}

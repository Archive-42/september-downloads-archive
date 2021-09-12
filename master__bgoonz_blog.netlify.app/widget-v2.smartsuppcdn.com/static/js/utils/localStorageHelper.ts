import { getSsWidget } from './sdk'
import { enableSoundsStorageName } from '../constants/localStorage'

const initialSoundState = localStorage.getItem(enableSoundsStorageName)

export const getInitSoundsState = () => {
	if (initialSoundState) {
		return initialSoundState === 'true'
	}
	if (getSsWidget().options.enableSounds !== undefined) {
		return getSsWidget().options.enableSounds!
	}

	return true
}

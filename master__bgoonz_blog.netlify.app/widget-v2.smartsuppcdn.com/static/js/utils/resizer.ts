export interface WindowSize {
	width: number
	height: number
}

export const FALLBACK_PARENT_SIZE_OBEJCT: WindowSize = {
	width: 1000,
	height: 700,
}

export const getParentWindowSize = (): WindowSize => ({
	height: window.parent.innerHeight || FALLBACK_PARENT_SIZE_OBEJCT.height,
	width: window.parent.innerWidth || FALLBACK_PARENT_SIZE_OBEJCT.width,
})

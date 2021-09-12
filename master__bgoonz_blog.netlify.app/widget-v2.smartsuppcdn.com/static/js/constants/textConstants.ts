import store from '../store'
import { isWidgetMobile } from '../store/general/selectors'

const FONT_SIZE_DESKTOP = 15
const FONT_SIZE_MOBILE = 16

export const DEFAULT_FONT_SIZE = isWidgetMobile(store.getState()) ? FONT_SIZE_MOBILE : FONT_SIZE_DESKTOP

export const MAIN_FONT_FAMILY = `'Segoe UI','-apple-system', 'BlinkMacSystemFont', 'Ubuntu', 'sans-serif'`

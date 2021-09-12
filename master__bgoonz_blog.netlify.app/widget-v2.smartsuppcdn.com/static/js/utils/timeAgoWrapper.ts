import { format, register, LocaleFunc } from 'timeago.js'
import { TranslationService as T } from './TranslationService'

const TIMEAGO_LOCALE = 'timeago-custom-locale'

export const registerTimeAgoLocale = (): void => {
	// We create custom locale that we register in App.tsx on startUp
	// Documentation is here: https://github.com/hustcc/timeago.js/blob/master/README.md
	// eslint-disable-next-line
	const localeFunc = (_number: number, index: number, _total_sec: number = 0) =>
		[
			[T.translate('timeago.justNow'), T.translate('timeago.rightNow')],
			[T.translate('timeago.XSecondsAgo'), T.translate('timeago.seconds')],
			[T.translate('timeago.oneMinuteAgo'), ''],
			[T.translate('timeago.XMinutesAgo'), ''],
			[T.translate('timeago.oneHourAgo'), ''],
			[T.translate('timeago.XHoursAgo'), ''],
			[T.translate('timeago.oneDayAgo'), ''],
			[T.translate('timeago.XDaysAgo'), ''],
			[T.translate('timeago.oneWeekAgo'), ''],
			[T.translate('timeago.XWeeksAgo'), ''],
			[T.translate('timeago.oneMonthAgo'), ''],
			[T.translate('timeago.XMonthsAgo'), ''],
			[T.translate('timeago.oneYearAgo'), ''],
			[T.translate('timeago.XYearsAgo'), ''],
		][index]

	// registering our locale with timeago
	register(TIMEAGO_LOCALE, localeFunc as LocaleFunc)
}

export const getTimestampInWords = (date: Date): string => format(date, TIMEAGO_LOCALE)

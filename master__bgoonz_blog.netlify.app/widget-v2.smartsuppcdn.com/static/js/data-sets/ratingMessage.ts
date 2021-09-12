import { v4 } from 'uuid'
import { MessageSubType, MessageContent } from '@smartsupp/websocket-client'
import { MessageRating } from '../model/Message'
import { TranslationService as T } from '../utils/TranslationService'
import { FormInputType } from '../model/FormInput'
import { Rating } from '../model/Rating'

export const createRatingFormMessage = (
	rating: Rating,
	finished: boolean,
	value = '',
	created = new Date(),
	messageId = v4(),
	finishedRatingText = undefined as string | undefined,
): MessageRating => ({
	type: MessageContent.Type.RateForm,
	author: MessageSubType.System,
	created,
	finished,
	id: messageId,
	headline: T.translate(rating.formText),
	inputs: [
		{
			type: FormInputType.Text,
			name: 'rating',
			placeHolder: T.translate(rating.formPlaceholder),
			label: T.translate(rating.formText),
			validations: ['required'],
			multiline: true,
			fullWidth: true,
			value,
		},
	],
	rating: rating.type,
	finishedRatingText,
})

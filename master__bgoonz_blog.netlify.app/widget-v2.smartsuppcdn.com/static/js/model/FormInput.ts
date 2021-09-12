import { Group } from '@smartsupp/websocket-client'

// lot of other rules can be used in the future
// https://www.npmjs.com/package/react-form-validator-core
export enum phoneRegex {
	phone = 'matchRegexp:^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$',
}

export type Validation = 'required' | 'isEmail' | phoneRegex.phone

export enum FormInputType {
	Text = 'TEXT',
	DropDown = 'DROP_DOWN',
	Checkbox = 'CHECKBOX',
}

/**
 * Interface for once form input
 */
export interface FormBase {
	name: string
	placeHolder: string
	label: string
	multiline: boolean
	fullWidth: boolean
	hideFilled?: boolean
	/**
	 * List of validation rules
	 */
	validations: Validation[]
	value: string | boolean
	greyBg?: boolean
	requiredCheck?: boolean
}

export interface DropDownChoice {
	name: string
	value: string
}

export interface FormTextCheckbox extends FormBase {
	type: FormInputType.Checkbox
}

export interface FormTextInput extends FormBase {
	type: FormInputType.Text
}

export interface FormDropDown extends FormBase {
	type: FormInputType.DropDown
	choices: Group[]
}

export type FormInput = FormTextInput | FormDropDown | FormTextCheckbox

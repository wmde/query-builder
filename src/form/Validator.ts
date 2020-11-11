import FormValues, { FieldErrors } from '@/form/FormValues';
import Error from '@/data-model/Error';

export interface ValidationResult {
	formErrors: Error[];
	fieldErrors: FieldErrors;
}

export default class Validator {
	private readonly formValues: FormValues;
	public constructor( formValues: FormValues ) {
		this.formValues = formValues;
	}

	public validate(): ValidationResult {
		const validationResult: ValidationResult = {
			formErrors: [],
			fieldErrors: {
				property: null,
				value: null,
			},
		};

		if ( !this.formValues.property && !this.formValues.value ) {
			validationResult.formErrors.push( {
				// eslint-disable-next-line max-len
				message: 'Looks like the Query Builder was empty, please enter a valid query first, then try running it again',
				type: 'notice',
			} );
			return validationResult;
		}

		if ( !this.formValues.property || !this.formValues.value ) {
			if ( !this.formValues.property ) {
				validationResult.fieldErrors.property = {
					message: 'Please select a property',
					type: 'error',
				};
			}
			if ( !this.formValues.value ) {
				validationResult.fieldErrors.value = {
					message: 'Please enter a value',
					type: 'error',
				};
			}
			validationResult.formErrors.push( {
				message: 'One or more fields are empty. Please complete the query or select a fitting field type.',
				type: 'error',
			} );
		}
		return validationResult;
	}
}

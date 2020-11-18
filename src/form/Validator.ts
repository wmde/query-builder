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
				message: 'query-builder-result-error-empty-form',
				type: 'notice',
			} );
			return validationResult;
		}

		if ( !this.formValues.property || !this.formValues.value ) {
			if ( !this.formValues.property ) {
				validationResult.fieldErrors.property = {
					message: 'query-builder-result-error-missing-property',
					type: 'error',
				};
			}
			if ( !this.formValues.value ) {
				validationResult.fieldErrors.value = {
					message: 'query-builder-result-error-missing-value',
					type: 'error',
				};
			}
			validationResult.formErrors.push( {
				message: 'query-builder-result-error-incomplete-form',
				type: 'error',
			} );
		}
		return validationResult;
	}
}

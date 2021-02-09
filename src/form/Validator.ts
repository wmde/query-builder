import FormValues, { FieldErrors } from '@/form/FormValues';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';

export interface ValidationResult {
	formErrors: Error[];
	fieldErrors: FieldErrors[];
}

export default class Validator {
	private readonly formValues: FormValues[];
	public constructor( formValues: FormValues[] ) {
		this.formValues = formValues;
	}

	public validate(): ValidationResult {
		const validationResult: ValidationResult = {
			formErrors: [],
			fieldErrors: [],
		};

		if ( this.isEmpty() ) {
			validationResult.formErrors.push( {
				message: 'query-builder-result-error-empty-form',
				type: 'notice',
			} );
			validationResult.fieldErrors.push( {
				property: null,
				value: null,
			} );
			return validationResult;
		}

		validationResult.fieldErrors = this.formValues.map(
			( formValues ) => this.validateCondition( formValues ),
		);

		if ( validationResult.fieldErrors.some( ( { property, value } ) =>
			property !== null || value !== null,
		) ) {
			validationResult.formErrors.push( {
				message: 'query-builder-result-error-incomplete-form',
				type: 'error',
			} );
		}

		return validationResult;
	}

	private validateCondition( formValues: FormValues ): FieldErrors {
		const fieldErrors: FieldErrors = {
			property: null,
			value: null,
		};
		if ( !formValues.property?.id ) {
			fieldErrors.property = {
				message: 'query-builder-result-error-missing-property',
				type: 'error',
			};
		}
		if (
			formValues.propertyValueRelation !== PropertyValueRelation.Regardless &&
			!formValues.value
		) {
			fieldErrors.value = {
				message: 'query-builder-result-error-missing-value',
				type: 'error',
			};
		}

		return fieldErrors;
	}

	private isEmpty(): boolean {
		if ( this.formValues.length === 0 ) {
			return true;
		}

		return this.formValues.length === 1 &&
			!this.formValues[ 0 ].property?.id &&
			!this.formValues[ 0 ].value;
	}
}

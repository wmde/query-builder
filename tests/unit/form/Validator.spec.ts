import FormValues from '@/form/FormValues';
import Validator, { ValidationResult } from '@/form/Validator';

describe( 'validator', () => {
	it( 'returns no errors with a complete form', () => {
		const formValues: FormValues = {
			property: {
				id: 'P31',
				label: 'instance of',
			},
			value: 'Q5',
		};

		const expectedResult: ValidationResult = {
			formErrors: [],
			fieldErrors: {
				property: null,
				value: null,
			},
		};

		const validator = new Validator( formValues );

		expect( validator.validate() ).toStrictEqual( expectedResult );
	} );

	it( 'returns one error with a property missing', () => {
		const formValues: FormValues = {
			property: null,
			value: 'Q5',
		};

		const expectedResult: ValidationResult = {
			formErrors: [
				{
					type: 'error',
					message: 'query-builder-result-error-incomplete-form',
				},
			],
			fieldErrors: {
				property: {
					type: 'error',
					message: 'query-builder-result-error-missing-property',
				},
				value: null,
			},
		};

		const validator = new Validator( formValues );

		expect( validator.validate() ).toStrictEqual( expectedResult );

	} );

	it( 'returns one error with a value missing', () => {
		const formValues: FormValues = {
			property: {
				id: 'P31',
				label: 'instance of',
			},
			value: null,
		};

		const expectedResult: ValidationResult = {
			formErrors: [
				{
					type: 'error',
					message: 'query-builder-result-error-incomplete-form',
				},
			],
			fieldErrors: {
				property: null,
				value: {
					type: 'error',
					message: 'query-builder-result-error-missing-value',
				},
			},
		};

		const validator = new Validator( formValues );

		expect( validator.validate() ).toStrictEqual( expectedResult );
	} );

	it( 'returns notice when the form is empty', () => {
		const formValues: FormValues = {
			property: null,
			value: null,
		};

		const expectedResult: ValidationResult = {
			formErrors: [
				{
					type: 'notice',
					message: 'query-builder-result-error-empty-form',
				},
			],
			fieldErrors: {
				property: null,
				value: null,
			},
		};

		const validator = new Validator( formValues );

		expect( validator.validate() ).toStrictEqual( expectedResult );
	} );
} );

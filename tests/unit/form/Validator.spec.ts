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

	it( 'property missing', () => {
		const formValues: FormValues = {
			property: null,
			value: 'Q5',
		};

		const formErrors = [
			{
				type: 'error',
			},
		];

		const validator = new Validator( formValues );
		const validationResult = validator.validate();

		expect( validationResult.formErrors ).toHaveLength( 1 );
		expect( validationResult.formErrors[ 0 ].type ).toBe( formErrors[ 0 ].type );
		expect( validationResult.fieldErrors.property ).not.toBeNull();
		expect( validationResult.fieldErrors.value ).toBeNull();
		expect( validationResult.fieldErrors.property ).toHaveProperty( 'type' );

	} );

	it( 'value missing', () => {
		const formValues: FormValues = {
			property: {
				id: 'P31',
				label: 'instance of',
			},
			value: null,
		};

		const formErrors = [
			{
				type: 'error',
			},
		];

		const validator = new Validator( formValues );
		const validationResult = validator.validate();

		expect( validationResult.formErrors ).toHaveLength( 1 );
		expect( validationResult.formErrors[ 0 ].type ).toBe( formErrors[ 0 ].type );
		expect( validationResult.fieldErrors.property ).toBeNull();
		expect( validationResult.fieldErrors.value ).not.toBeNull();
		expect( validationResult.fieldErrors.value ).toHaveProperty( 'type' );
	} );

	it( 'empty form', () => {
		const formValues: FormValues = {
			property: null,
			value: null,
		};

		const formErrors = [
			{
				type: 'notice',
			},
		];

		const validator = new Validator( formValues );
		const validationResult = validator.validate();

		expect( validationResult.formErrors ).toHaveLength( 1 );
		expect( validationResult.formErrors[ 0 ].type ).toBe( formErrors[ 0 ].type );
		expect( validationResult.fieldErrors.property ).toBeNull();
		expect( validationResult.fieldErrors.value ).toBeNull();
	} );
} );

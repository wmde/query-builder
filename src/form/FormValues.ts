import Property from '@/data-model/Property';
import Error from '@/data-model/Error';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export default interface FormValues {
	property: Property | null;
	value: string | null;
	propertyValueRelation: PropertyValueRelation;
}

export interface FieldErrors {
	property: Error | null;
	value: Error | null;
}

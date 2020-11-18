import Property from '@/data-model/Property';
import Error from '@/data-model/Error';

export default interface FormValues {
	property: Property | null;
	value: string | null;
}

export interface FieldErrors {
	property: Error | null;
	value: Error | null;
}

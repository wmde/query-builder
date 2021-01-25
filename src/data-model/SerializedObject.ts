import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { Value } from '@/store/RootState';

export default interface SerializedCondition {
	propertyId: string;
	propertyDataType: string | null;
	propertyValueRelation: PropertyValueRelation;
	value: string | Value;
	subclasses: boolean;
	negate: boolean;
}

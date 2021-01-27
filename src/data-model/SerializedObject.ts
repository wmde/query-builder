import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import { Value } from '@/store/RootState';
import ConditionRelation from './ConditionRelation';

export default interface SerializedCondition {
	propertyId: string;
	propertyDataType: string | null;
	propertyValueRelation: PropertyValueRelation;
	value: string | Value;
	subclasses: boolean;
	conditionRelation: ConditionRelation | null;
	negate: boolean;
}

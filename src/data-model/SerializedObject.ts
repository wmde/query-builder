import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ConditionRelation from './ConditionRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';

export default interface SerializedCondition {
	propertyId: string;
	propertyDataType: string | null;
	propertyValueRelation: PropertyValueRelation;
	referenceRelation: ReferenceRelation;
	value: string;
	subclasses: boolean;
	conditionRelation: ConditionRelation | null;
	negate: boolean;
}

import ConditionRelation from '@/data-model/ConditionRelation';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';

export type Condition = {
	propertyId: string;
	value: string;
	datatype: string; // FIXME: make enum?
	propertyValueRelation: PropertyValueRelation;
	referenceRelation: ReferenceRelation;
	subclasses: boolean;
	conditionRelation: ConditionRelation | null;
	negate: boolean;
};

export default interface QueryRepresentation {
	conditions: Condition[];
	limit?: number;
	omitLabels: boolean;
}

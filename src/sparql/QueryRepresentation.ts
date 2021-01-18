import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export type Condition = {
	propertyId: string;
	value: string;
	datatype: string; // FIXME: make enum?
	propertyValueRelation: PropertyValueRelation;
	subclasses: boolean;
	negate: boolean;
};

export default interface QueryRepresentation {
	conditions: Condition[];
	limit?: number;
	omitLabels: boolean;
}

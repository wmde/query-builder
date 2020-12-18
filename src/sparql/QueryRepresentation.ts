import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export type Condition = {
	propertyId: string;
	value: string;
	datatype: string; // FIXME: make enum?
	propertyValueRelation: PropertyValueRelation;
};

export default interface QueryRepresentation {
	conditions: Condition[];
}

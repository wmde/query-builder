import PropertyValueRelation from '@/data-model/PropertyValueRelation';

export type Condition = {
	propertyId: string;
	value: string;
	propertyValueRelation: PropertyValueRelation;
};

export default interface QueryRepresentation {
	condition: Condition;
}

export type Condition = {
	propertyId: string;
	value: string;
};

export default interface QueryRepresentation {
	condition: Condition;
}

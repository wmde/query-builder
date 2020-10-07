export default interface SparqlGenerator {
	// Todo define query object type and use it here
	stringify( query: object ): string;
}

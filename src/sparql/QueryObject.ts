// Query object describing SPARQL.js query object: https://github.com/RubenVerborgh/SPARQL.js
interface Variable {
	termType: string;
	value: string;
}

interface Triple {
	subject: Variable;
	predicate: Variable;
	object: Variable;
}

interface Condition {
	type: string;
	triples: Triple[];
}

export default interface QueryObject {
	queryType: string;
	variables: Variable[];
	where: Condition[];
	type: string;
	prefixes: { [key: string]: string };
}

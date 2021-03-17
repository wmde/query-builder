import {
	BgpPattern,
	BlankTerm,
	IriTerm,
	PropertyPath,
	QuadTerm,
	Term,
	Triple,
	VariableTerm,
} from 'sparqljs';

export default class SyntaxBuilder {

	public buildSimpleTriple(
		subject: IriTerm | BlankTerm | VariableTerm | QuadTerm,
		predicateValue: string,
		object: Term,
	): Triple {
		return {
			subject,
			predicate: {
				termType: 'NamedNode',
				value: predicateValue,
			},
			object,
		};
	}

	public buildPathTriple(
		subject: IriTerm | BlankTerm | VariableTerm | QuadTerm,
		pathItems: ( string | PropertyPath )[],
		object: Term,
	): Triple {
		return {
			subject,
			predicate: this.buildPropertyPath(
				'/',
				pathItems.map( ( predicateItem ): IriTerm | PropertyPath => {
					if ( typeof predicateItem === 'string' ) {
						return {
							termType: 'NamedNode',
							value: predicateItem,
						};
					}
					return predicateItem;
				} ) ),
			object,
		};
	}

	public buildPropertyPath(
		pathType: '|' | '/' | '^' | '+' | '*' | '!',
		pathItems: ( IriTerm | PropertyPath )[],
	): PropertyPath {
		return {
			type: 'path',
			pathType,
			items: pathItems,
		};
	}

	public buildVariableTermFromName( name: string ): VariableTerm {
		return {
			termType: 'Variable',
			value: name,
		};
	}

	public buildBgpPattern( triples: Triple[] ): BgpPattern {
		return {
			type: 'bgp',
			triples,
		};
	}
}

import ParseResult from './ParseResult';

/**
 * Repository to parse values using ValueParser
 */
export default interface ParseValueRepository {
	parseValues( values: string[], datatype: string ): Promise<ParseResult[]>;
}

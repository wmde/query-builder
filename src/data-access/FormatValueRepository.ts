import ParseResult from './ParseResult';

/**
 * Repository to format DataValues
 */
export default interface FormatValueRepository {
	formatValue( dataValue: ParseResult, propertyId: string ): Promise<string>;
}

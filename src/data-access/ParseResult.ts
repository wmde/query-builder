export default interface ParseResult {
	value: {
		time: string;
		timezone: number;
		before: number;
		after: number;
		precision: number;
		calendarmodel: string;
	};
	type: string;
}

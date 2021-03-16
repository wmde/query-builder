export default class PrecisionError extends Error {
	public constructor() {
		super();

		this.message = 'Precisions less than 9 are not supported. supported precisions: 9,10,11';
		this.name = 'PrecisionError';
	}
}

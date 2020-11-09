export default interface Error {
	message: string;
	type: 'error' | 'warning' | 'notice';
}

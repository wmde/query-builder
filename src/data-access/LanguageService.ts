export default interface LanguageService {
	getAppLanguageCode(): string;
	getMessagesForLangCode( code: string ): Promise<{ [key: string]: string}>;
}

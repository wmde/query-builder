import AbstractLanguageService from '@/data-access/AbstractLanguageService';
import LanguageService from '@/data-access/LanguageService';

export default class FetchLanguageService extends AbstractLanguageService implements LanguageService {
	public async getMessagesForLangCode( code: string ): Promise<{ [ p: string ]: string }> {
		try {
			const responseLang = await fetch( 'i18n/' + code + '.json' );
			return await responseLang.json();
		} catch ( e ) {
			console.warn( 'The language requested could not be retrieved, falling back to English' );
			return Promise.resolve( {} );
		}
	}
}

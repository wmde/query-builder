import StatsvMetricsCollector from '@/data-access/StatsvMetricsCollector';

describe( 'StatsvMetricsCollector', () => {

	it( 'does not send anything if endpoint is empty', async () => {
		const metricsCollector = new StatsvMetricsCollector( 'prefix', null );
		navigator.sendBeacon = jest.fn();

		metricsCollector.increment( 'bar' );

		expect( navigator.sendBeacon ).toHaveBeenCalledTimes( 0 );
	} );
	it( 'sends increment for the metric', async () => {
		const metricsCollector = new StatsvMetricsCollector( 'prefix', 'https://example.com/beacon' );
		const expectedUrl = 'https://example.com/beacon?prefix.bar=1c';
		navigator.sendBeacon = jest.fn();

		metricsCollector.increment( 'bar' );

		expect( navigator.sendBeacon ).toHaveBeenCalledTimes( 1 );
		expect( navigator.sendBeacon ).toHaveBeenCalledWith( expectedUrl );
	} );
} );

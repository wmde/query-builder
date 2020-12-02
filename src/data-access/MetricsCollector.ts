export default interface MetricsCollector {
	increment( metric: string ): void;
}

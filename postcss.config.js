module.exports = {
	plugins: [
		require( 'autoprefixer' ),
		require( 'postcss-logical' )( { preserve: true } ),
		require( 'postcss-dir-pseudo-class' )
	]
};

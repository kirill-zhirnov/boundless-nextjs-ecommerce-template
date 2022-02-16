const webpack = require('webpack');

module.exports = {
	images: {
		domains: ['dev-img.boundless-commerce.com']
	},
	webpack: (config) => {
		const defineMap = {};

		[
			'BOUNDLESS_BASE_URL',
			'BOUNDLESS_API_BASE_URL',
			'BOUNDLESS_API_PERMANENT_TOKEN',
			'BOUNDLESS_S3_PREFIX',
			'BOUNDLESS_INSTANCE_ID',
			'BOUNDLESS_PRODUCTS_IMAGE_PROPORTION'
		].forEach((key) => defineMap[`process.env.${key}`] = JSON.stringify(process.env[key]));

		config.plugins.push(
			new webpack.DefinePlugin(defineMap)
		);

		return config;
	},
};

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true'
// });

// module.exports = withBundleAnalyzer({});

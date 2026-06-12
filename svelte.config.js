import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/config').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.env.BASE_PATH || ''
		}
	}
};

export default config;

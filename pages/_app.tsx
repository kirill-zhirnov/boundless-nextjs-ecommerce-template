import Head from 'next/head';
import 'nprogress/nprogress.css';
import '../styles/styles.scss';
// import 'swiper/swiper.scss';
import {AppProps} from 'next/app';


function MyApp({Component, pageProps}: AppProps) {
	return (
		<>
			<Head>
				<title>Boundless-Commerce Shop Example</title>
			</Head>

			<Component {...pageProps} />

		</>
	);
}

export default MyApp;

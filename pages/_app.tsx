import {Provider} from 'react-redux';
import {store} from '../redux/store';
import 'nprogress/nprogress.css';
import '../styles/styles.scss';
// import 'swiper/swiper.scss';
import {AppProps} from 'next/app';

function MyApp({Component, pageProps}: AppProps) {
	return (
		<>
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</>
	);
}

export default MyApp;

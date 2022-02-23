import {Provider} from 'react-redux';
import {store} from '../redux/store';
import 'nprogress/nprogress.css';
import '../styles/styles.scss';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'animate.css';

import '@fortawesome/fontawesome-free/css/svg-with-js.css';

import {AppProps} from 'next/app';
import RouterListener from '../components/RouterListener';
import LoadingLine from '../components/LoadingLine';

function MyApp({Component, pageProps}: AppProps) {
	return (
		<Provider store={store}>
			<RouterListener />
			<LoadingLine />
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;

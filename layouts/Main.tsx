import {ReactNode} from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingLine from '../components/LoadingLine';
import AlertWidget from '../components/Alert';

const shopBaseUrl = process.env.BOUNDLESS_BASE_URL || '';

export default function MainLayout({children, title, metaData}: IMainLayoutProps) {
	const {canonicalUrl, imgUrl, description} = metaData || {};

	return (
		<>
			<Head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<meta httpEquiv='X-UA-Compatible' content='ie=edge' />

				<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
				<link rel='manifest' href='/site.webmanifest' />
				<link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
				{canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />

				<meta property='og:type' content='website' />
				<meta property='og:title' content={title || 'Boundless-Commerce Shop Example'} />
				<meta property='og:url' content={canonicalUrl || shopBaseUrl} />
				{imgUrl && <meta property='og:image' content={imgUrl} />}
				{description && <meta property='og:description' content={description} />}

				<title>{title || 'Boundless-Commerce Shop Example'}</title>
			</Head>
			<LoadingLine />
			<AlertWidget />
			<div className='page'>
				<Header />
				<main className='page__main'>
					{children}
				</main>
				<Footer />
			</div>
		</>
	);
}

interface IMainLayoutProps {
	children: ReactNode | ReactNode[];
	title?: string;
	metaData?: IMetaData;
}

interface IMetaData {
	canonicalUrl?: string;
	imgUrl?: string|null;
	description?: string|null;
}
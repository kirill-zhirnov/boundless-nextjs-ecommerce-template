import {ReactNode} from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingLine from '../components/LoadingLine';

export default function MainLayout({children, title}: {children: ReactNode | ReactNode[], title?: string}) {
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
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />

				<title>{title || 'Boundless-Commerce Shop Example'}</title>
			</Head>
			<LoadingLine />
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

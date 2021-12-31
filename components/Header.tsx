import Link from 'next/link';

export default function Header() {
	return (
		<header className='page__header' >
			<div className='container text-center'>

				<h1><Link href='/'>Boundless-Commerce Demo Shop</Link></h1>
			</div>
		</header>
	);
}

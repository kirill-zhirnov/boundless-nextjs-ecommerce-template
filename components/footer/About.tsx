import Link from 'next/link';
import logoImg from '../../assets/logo.svg';

export default function FooterAbout({companyTitle}: {companyTitle?: string}) {
	const title = companyTitle || 'Your Company LLC.';
	return (
		<>
			<div className='footer__logo'>
				<Link href='/'>
					<a>
						<img src={logoImg.src} width={logoImg.width} height={logoImg.height} alt={title} />
					</a>
				</Link>
			</div>
			<div className='footer__company-info'>
				<p className='title'>{title}</p>
			</div>
			<div className='footer__disclaimer'>
				<p className='text-muted small'>
					This website and its contents are provided "as is" and "as available" without any warranty or representations of any kind, whether express or implied.
					Price and availability information is subject to change without notice.
				</p>
			</div>
		</>
	);
}
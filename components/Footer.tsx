import FooterMenu from './footer/FooterMenu';
import SocialButtons from './footer/SocialButtons';
import FooterContacts from './footer/Contacts';
import FooterAbout from './footer/About';
import {IMenuItem} from '../@types/components';

export default function Footer({menuList, companyTitle}: {menuList: IMenuItem[], companyTitle?: string}) {
	return (
		<footer className='page-footer'>
			<div className='container'>
				<div className='row'>
					<div className='page-footer__item col-sm-12 col-md-6 col-lg-3 order-lg-1 order-md-3 order-4'>
						<FooterAbout companyTitle={companyTitle}/>
					</div>
					<div className='page-footer__item col-sm-12 col-md-6 col-lg-3 order-lg-2 order-md-1 order-1'>
						<FooterMenu menuList={menuList} />
					</div>
					<div className='page-footer__item col-sm-12 col-md-6 col-lg-3 order-lg-3 order-md-2 order-2'>
						<FooterContacts />
					</div>
					<div className='page-footer__item col-sm-12 col-md-6 col-lg-3 order-lg-4 order-md-4 order-3'>
						<SocialButtons />
					</div>
				</div>
			</div>
		</footer>
	);
}

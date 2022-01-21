import {MouseEvent} from 'react';
import Link from 'next/link';
import CallToOrder from './header/CallToOrder';
import HeaderCart from './header/Cart';
import ChooseVariantModal from './header/ChooseVariantModal';
import logoImg from '../assets/logo.svg';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useAppDispatch} from '../hooks/redux';
import {setIsOpened} from '../redux/reducers/asideMenu';

export default function Header() {
	const dispatch = useAppDispatch();

	const onHamburgerBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(setIsOpened(true));
	};

	return (
		<header className='page__header'>
			<div className='container text-center position-relative'>
				<div className='d-flex justify-content-between py-2'>
					<div className='page__header-logo'>
						<Link href='/'>
							<a>
								<img src={logoImg.src} width={logoImg.width} height={logoImg.height} alt={'Boundless commerce store'} />
							</a>
						</Link>
					</div>
					<HeaderCart />
					<button type={'button'}
									className={'btn btn-outline-secondary'}
									onClick={onHamburgerBtnClicked}
					>
						<FontAwesomeIcon icon={faBars} />
					</button>
				</div>
				<CallToOrder />
			</div>
			<ChooseVariantModal />
		</header>
	);
}

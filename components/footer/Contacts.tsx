import {faWhatsapp} from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import {faClock} from '@fortawesome/free-solid-svg-icons/faClock';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function FooterContacts() {
	return (
		<>
			<h3 className='footer__header'>Contact Us</h3>
			<p className='footer__icon-w-link'>
				<span className='icon'>
					<FontAwesomeIcon icon={faWhatsapp} />
				</span>
				<a className='link' href='tel:+18001234567'>+1 (800) 123-45-67</a>
			</p>
			<p className='footer__icon-w-link'>
				<span className='icon'>
					<FontAwesomeIcon icon={faMapMarkerAlt} />
				</span>
				<a className='link' href='#'>1 infinite loop, Cupertino, CA 95014</a>
			</p>
			<p className='footer__icon-w-link'>
				<span className='icon'>
					<FontAwesomeIcon className='icon' icon={faClock} />
				</span>
				9:00am &mdash; 6:00pm
			</p>
		</>
	);
}
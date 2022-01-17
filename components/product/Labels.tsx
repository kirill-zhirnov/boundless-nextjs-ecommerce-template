import {ILabel, TLabelIcon} from 'boundless-api-client';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {faFlag} from '@fortawesome/free-solid-svg-icons/faFlag';
import {faFire} from '@fortawesome/free-solid-svg-icons/faFire';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {faTag} from '@fortawesome/free-solid-svg-icons/faTag';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';

export default function ProductLabels({labels}: {labels: ILabel[]}) {
	if (!labels.length)
		return null;

	return (
		<ul className={'product__labels list-unstyled'}>
			{labels.map(({label_id, title, color, text_color, icon}) =>
				<li key={label_id}
						className={'product__label'}
						style={{color: text_color, backgroundColor: color}}
				>
					<LabelIcon icon={icon} /> {title}
				</li>
			)}
		</ul>
	);
}

const LabelIcon = ({icon}: {icon: string|null}) => {
	let faIcon;
	switch (icon) {
		case TLabelIcon.star:
			faIcon = faStar;
			break;

		case TLabelIcon.flag:
			faIcon = faFlag;
			break;

		case TLabelIcon.fire:
			faIcon = faFire;
			break;

		case TLabelIcon.ok:
			faIcon = faCheck;
			break;

		case TLabelIcon.tag:
			faIcon = faTag;
			break;

		case TLabelIcon.heart:
			faIcon = faHeart;
			break;
	}

	if (!faIcon)
		return null;

	return <FontAwesomeIcon icon={faIcon} />;
};
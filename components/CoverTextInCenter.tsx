import clsx from 'clsx';
import Link from 'next/link';
import {getBgImg} from '../lib/imgs';

export default function CoverTextInCenter({img, imgPortrait, shadow, content, link, fixed = true}: CoverTextInCenterProps) {
	const imageUrl = `url(${getBgImg(img)})`;
	const portraitUrl = imgPortrait ? `url(${getBgImg(imgPortrait)})` : '';

	return (
		<div className='cover-text-center'>
			<div className={clsx('cover-text-center__wrapper', fixed && 'cover-text-center__wrapper_fixed')}>
				<div
					className={clsx('cover-text-center__bg-img', portraitUrl && 'cover-text-center__bg-img_with-portrait')}
					style={{backgroundImage: imageUrl}}
				/>
				{portraitUrl &&
					<div
						className='cover-text-center__bg-img cover-text-center__bg-img_portrait'
						style={{backgroundImage: portraitUrl}}
					/>}
				{shadow && <div className='cover-text-center__shadow' style={shadow} />}
				<div className='cover-text-center__content'>
					{link
						? <Link href={link}>
							<a className='cover-text-center__content-container container'>
								<CoverContent {...content} />
							</a>
						</Link>
						: <div className='cover-text-center__content-container container'>
							<CoverContent {...content} />
						</div>}
				</div>
			</div>
		</div>
	);
}

function CoverContent({intro, head, subHead}: ICoverTextContent) {
	return (
		<>
			{intro && <div className='cover-text-center__content-intro' dangerouslySetInnerHTML={{__html: intro}} />}
			{head && <div className='cover-text-center__content-head' dangerouslySetInnerHTML={{__html: head}} />}
			{subHead && <div className='cover-text-center__content-sub-header' dangerouslySetInnerHTML={{__html: subHead}} />}
		</>
	);
}

interface CoverTextInCenterProps {
	img: string;
	imgPortrait?: string;
	content: ICoverTextContent;
	link?: string;
	fixed?: boolean;
	shadow?: ICoverShadow
}

interface ICoverTextContent {
	intro?: string;
	head?: string;
	subHead?: string;
}

interface ICoverShadow {
	backgroundColor: string;
	opacity: number;
}
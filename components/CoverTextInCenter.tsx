import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

export default function CoverTextInCenter({img, imgPortrait, shadow, content, link, showChevronDown, fixed = true}: CoverTextInCenterProps) {
	const imageUrl = `url(${img})`;
	const portraitUrl = `url(${imgPortrait})`;
	const isGlobalLink = Boolean(link && /^http/.test(link));
	const linkProps = isGlobalLink ? {target: '_blank'} : {};

	const scrollDown = (e: React.MouseEvent) => {
		e.preventDefault();
		window.scrollBy({
			top: window.innerHeight,
			left: 0,
			behavior: 'smooth'
		});
	};

	return (
		<div className='cover-text-center'>
			<div className={clsx('cover-text-center__wrapper', fixed && 'cover-text-center__wrapper_fixed')}>
				<div
					className='cover-text-center__bg-img'
					style={{backgroundImage: imageUrl}}
				/>
				<div
					className='cover-text-center__bg-img cover-text-center__bg-img_portrait'
					style={{backgroundImage: portraitUrl}}
				/>
				{shadow && <div className='cover-text-center__shadow' style={shadow} />}
				<div className='cover-text-center__content'>
					{link
						? <Link
								href={link}
								className='cover-text-center__content-container container'
								{...linkProps}>
								<CoverContent {...content} />
							</Link>
						: <div className='cover-text-center__content-container container'>
							<CoverContent {...content} />
						</div>}
				</div>
				{showChevronDown && <a
					href='#'
					className='cover-text-center__down'
					onClick={scrollDown}
				>
					<FontAwesomeIcon icon={faChevronDown} />
				</a>}
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
	imgPortrait: string;
	content: ICoverTextContent;
	showChevronDown: boolean;
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
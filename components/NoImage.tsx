import {TThumbRatio} from 'boundless-api-client';
import clsx from 'clsx';

export default function NoImage({ratio, className}: {ratio: TThumbRatio, className?: string}) {
	return (
		<div className={clsx(`no-image r-${ratio}`, className)}>
			<div className={'no-image__bg'}></div>
		</div>
	);
}
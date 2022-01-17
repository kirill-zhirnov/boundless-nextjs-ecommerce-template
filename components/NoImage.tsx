import {TThumbRatio} from '../@types/image';

export default function NoImage({ratio}: {ratio: TThumbRatio}) {
	return (
		<div className={`no-image r-${ratio}`}>
			<div className={'no-image__bg'}></div>
		</div>
	);
}
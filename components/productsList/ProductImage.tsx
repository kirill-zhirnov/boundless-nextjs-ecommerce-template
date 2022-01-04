import Image from 'next/image';
import {getProductsListImg, IImagePartial} from '../../lib/services/imgs';

export default function ProductImage({image, alt, maxSize = 200}: {image: IImagePartial, alt: string, maxSize?: number}) {
	const {src, blurSrc, width, height} = getProductsListImg(image, maxSize);

	return (
		<div className={'img text-center'}>
			{width && height
				? <Image
					src={src}
					width={width}
					height={height}
					placeholder='blur'
					blurDataURL={blurSrc}
					quality={100}
					itemProp='image'
					alt={alt}
				/>
				: <img src={src}
					alt={alt}
					itemProp='image'
				/>}
		</div>
	);
}
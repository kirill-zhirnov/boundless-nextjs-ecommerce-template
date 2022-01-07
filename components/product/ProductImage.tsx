import Image from 'next/image';
import {getProductImg, IImagePartial} from '../../lib/services/imgs';

export default function ProductImage({image, alt, maxSize = 200}: {image: IImagePartial, alt: string, maxSize?: number}) {
	const {src, blurSrc, width, height} = getProductImg(image, maxSize);

	return (
		<>
			{width && height
				? <Image
					src={src}
					width={width}
					height={height}
					placeholder='blur'
					blurDataURL={blurSrc}
					quality={100}
					alt={alt}
				/>
				: <img src={src}
					alt={alt}
					itemProp='image'
				/>}
		</>
	);
}
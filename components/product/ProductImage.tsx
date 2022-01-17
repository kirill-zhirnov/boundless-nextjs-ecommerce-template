import Image from 'next/image';
import {getProductImg, IImagePartial} from '../../lib/services/imgs';

export default function ProductImage({image, alt, maxSize = 800, preserveRatio = false}: IProductImageProps) {
	const {src, blurSrc, width, height} = getProductImg(image, maxSize, preserveRatio);

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
					priority
				/>
				: <img src={src}
					alt={alt}
					itemProp='image'
				/>}
		</>
	);
}

interface IProductImageProps {
	image: IImagePartial;
	alt: string;
	maxSize?: number;
	preserveRatio?: boolean;
}
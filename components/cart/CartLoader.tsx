import CartRowLoader from './CartRowLoader';

export default function CartLoader () {
	return (
		<div className='pt-md-4'>
			{[...Array(3)].map((_, i) => (
				<CartRowLoader key={i} bg={i % 2 === 0 ? '#f9f9f9' : ''} />
			))}
		</div>
	);
}
import ProductList from '../../components/blocks/ProductList';
import MainLayout from '../../layouts/Main';
import {apiRequest} from '../../lib/services/api';

export default function ProductsPage({data}: {data: any}) {
	return (
		<>
			<MainLayout>
				<div className='container'>
					<div className='row'>
						<div className='col-md-3 col-sm-4'>
							<div>Menu here</div>
						</div>
						<div className='col-md-9 col-sm-8'>
							<ProductList products={data} />
						</div>

					</div>
				</div>
			</MainLayout>
		</>
	);
}

export async function getStaticProps() {
	const {data} = await apiRequest.get('/catalog/products');
	console.log(data);

	return {
		props: {
			data
		}
	};
}
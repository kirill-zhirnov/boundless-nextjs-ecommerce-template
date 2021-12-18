import MainLayout from '../../layouts/Main';
import {apiClient} from '../../lib/services/api';
import {GetStaticProps, GetStaticPropsContext} from "next";

export default function CategoryPage({category}: {category: any}) {
	return (
		<>
			<MainLayout>
				<div className='container'>
					<div className='row'>
						<div className='col-md-3 col-sm-4'>
							Menu there
						</div>
						<div className='col-md-9 col-sm-8'>
							<h1>{category.text.title}</h1>
						</div>
					</div>
				</div>
			</MainLayout>
		</>
	);
}

//тут не разобрался с типизацией, можешь попробовать посмотреть, есть ли быстрое решение?
export const getStaticProps: GetStaticProps = async (context) => {
	//@ts-ignore
	const {data: category} = await apiClient.createRequest().get(`/catalog/categories/item/${context.params.slug}`);

	return {
		props: {
			category
		}
	};
}

export const getStaticPaths = async () => {
	return {
		// вот тут надо перечислять массив из всех-возможных
		// категорий, которые будут статично отрендерины. Получаещь по API список опубликованных не удаленных категорий и передаешь slug || category_id.
		paths: [
			{params: {slug: 'chekhly-na-iphone'}}
		],
		fallback: false
	};
};
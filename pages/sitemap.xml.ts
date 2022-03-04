import {GetServerSideProps} from 'next';
import xmlBuilder from 'xmlbuilder';
import {apiClient} from '../lib/api';
import {getCategoryUrl} from '../lib/urls';

export default function SiteMapXml() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async ({res}) => {
	const xmlRoot = xmlBuilder.begin().ele('urlset', {
		'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
		// 'xmlns:xhtml': 'http://www.w3.org/1999/xhtml'
	});


	//products
	const {pagination, products} = await apiClient.catalog.getProducts({'per-page': 100});
	if (pagination.pageCount > 1) {
		for (let page = 2; page <= pagination.pageCount; page++) {
			const {products: newProducts} = await apiClient.catalog.getProducts({'per-page': 100, page});
			products.push(...newProducts);
		}
	}
	const productPaths = products.map(product => (product.url_key || String(product.product_id)));

	for (const productPath of productPaths) {
		appendUrl(xmlRoot, productPath, '/product');
	}

	//categories
	const categories = await apiClient.catalog.getFlatCategories();
	for (const category of categories) {
		if (!category.custom_link) appendUrl(xmlRoot, getCategoryUrl(category));
	}

	xmlRoot.end({pretty: true});

	res.setHeader('Content-Type', 'text/xml');
	res.write(`<?xml version="1.0"?>${xmlRoot.toString()}`);
	res.end();

	return {
		props: {}
	};
};

function appendUrl(xmlParent: xmlBuilder.XMLElement, url: string, folder: string = '') {
	const xmlUrl = xmlParent.ele('url');
	const fullUrl = `${process.env.BOUNDLESS_BASE_URL}${folder ? `${folder}/` : ''}${url}`;
	xmlUrl.ele('loc', fullUrl);
	// xmlUrl.ele('xhtml:link', {rel: 'alternate'}, fullUrl);
	xmlUrl.ele('changefreq', 'monthly');
	xmlUrl.ele('priority', '0.5');
}
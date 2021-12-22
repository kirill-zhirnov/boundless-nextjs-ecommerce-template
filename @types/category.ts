import {ICategory} from 'boundless-api-client/types/catalog/category';

export type ICategoryPartial = Pick<ICategory, 'category_id' | 'title' | 'custom_link' | 'url_key' | 'image'> & {children?: ICategory[] | null};
import {ICategory} from 'boundless-api-client';

export type ICategoryPartial = Pick<ICategory, 'category_id' | 'title' | 'custom_link' | 'url_key' | 'image'> & {children?: ICategory[] | null};
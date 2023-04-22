import {ICurrency, ILocaleSettings} from 'boundless-api-client';

export interface IBasicSettings {
	'system.locale': ILocaleSettings,
	'system.currency': ICurrency
}
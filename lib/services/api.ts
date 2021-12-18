import { BoundlessClient } from 'boundless-api-client';

const baseURL = process.env.BOUNDLESS_API_BASE_URL;
const permanentToken = process.env.BOUNDLESS_API_PERMANENT_TOKEN;

export const apiClient = new BoundlessClient(permanentToken);
if (baseURL) apiClient.setBaseUrl(baseURL);

const options = {
	// General request options here
};

export const apiRequest = apiClient.createRequest(options);
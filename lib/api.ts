import {BoundlessClient} from 'boundless-api-client';

const baseURL = process.env.BOUNDLESS_API_BASE_URL;
const permanentToken = process.env.BOUNDLESS_API_PERMANENT_TOKEN;
const s3Prefix = process.env.BOUNDLESS_S3_PREFIX;
const mediaServer = process.env.BOUNDLESS_MEDIA_SERVER;

const apiClient = new BoundlessClient(permanentToken);
apiClient.setInstanceId(process.env.BOUNDLESS_INSTANCE_ID as unknown as number);

if (baseURL) {
	apiClient.setBaseUrl(baseURL);
}

if (s3Prefix) {
	apiClient.setS3FolderPrefix(s3Prefix);
}

if (mediaServer) {
	apiClient.setMediaServerUrl(mediaServer);
}

export {apiClient};
import React, {useEffect} from 'react';
import NProgress from 'nprogress';
import {useRouter} from 'next/router';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {RootState} from '../redux/store';
import {cleanPromises} from '../redux/reducers/xhr';
import {hideCall2Order} from '../redux/reducers/cart';

export default function LoadingLine() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const promises = useAppSelector((state: RootState) => state.xhr.promises);

	useEffect(() => {
		const handleStart = () => {
			dispatch(hideCall2Order());
			NProgress.start();
		};
		const handleComplete = () => NProgress.done();

		checkBgPromises();

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	});

	function checkBgPromises() {
		const size = promises.length;
		if (!size) return;

		NProgress.start();
		Promise.allSettled(promises)
			.then(() => {
				if (promises.length === size) {
					NProgress.done();
					dispatch(cleanPromises());
				}
			});
	}

	return <div />;
}
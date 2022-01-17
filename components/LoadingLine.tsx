import React, {useEffect} from 'react';
import NProgress from 'nprogress';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {RootState} from '../redux/store';
import {cleanPromises} from '../redux/reducers/xhr';

export default function LoadingLine() {
	const dispatch = useAppDispatch();
	const promises = useAppSelector((state: RootState) => state.xhr.promises);
	const isRouting = useAppSelector((state: RootState) => state.app.isRouteChanging);

	useEffect(() => {
		if (isRouting) NProgress.start();
		else NProgress.done();
	}, [isRouting]);

	useEffect(() => {
		checkBgPromises();
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
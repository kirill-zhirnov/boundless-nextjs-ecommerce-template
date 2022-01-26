import {useCallback, useEffect, useState} from 'react';

export default function useAnimation() {
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		if (animate) {
			timeout = setTimeout(() => {
				if (timeout) setAnimate(false);
			}, 1000);
		}

		return () => {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
		};
	}, [animate]);

	const triggerAnimate = useCallback(() => setAnimate(true), []);

	return {
		animate,
		triggerAnimate
	};
}
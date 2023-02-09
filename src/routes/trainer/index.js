import { useCallback, useEffect, useState } from 'preact/hooks';
import style from './style.module.css';

// Note: `user` comes from the URL, courtesy of our router
export default function Trainer({ user }) {
	const randomCountdown = () => Math.random() > 0.7 ? 700 : 2500;
	
	const [keyPressed, setKeyPressed] = useState(null);
	const [targetKey, setTargetKey] = useState(null);
	const [timeoutId, setTimeoutId] = useState(0);
	const [counter, setCounter] = useState(-1);
	const [hit, setHit] = useState(-1);
	const [miss, setMiss] = useState(-1);
	const [late, setLate] = useState(-1);

	const delay = 700;


	const items = [
		'q', 'w', 'e', 'r',
		'a', 's', 'd', 'f',
		'y', 'x', 'c', 'v'
	];

	const onStartClick = () => {
		setTimeout(() => {
			setCounter(0);
			setHit(0);
			setMiss(0);
			setLate(0);			
		}, 2000);
	}

	const keyPressHandler2 = ({ key }) =>{
		if (counter < 0) 
			return;
		setKeyPressed(key);
		setCounter(x => x + 1);
	};

	useEffect(() => {
		console.log('use effect');
		console.log(keyPressed);
		console.log(counter);

		if (counter === 0){
			setTimeoutId(setTimeout(() => {
				console.log('fail timeout');
				setLate(x => x + 1);
				setKeyPressed(null);
				setCounter(x => x + 1);
			}, delay));

			setTargetKey(items[Math.floor(Math.random() * items.length)]);
		} else if (counter > 0) {
			if (keyPressed) {
				if (keyPressed === targetKey) {
					console.log('hit', keyPressed, targetKey);
					setHit(x => x + 1);
				} else {
					console.log('miss', keyPressed, targetKey);
					setMiss(x => x + 1);				
				}	
			}

			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			if (counter === 20) {
				setCounter(-1)
				setTargetKey(null);
				setKeyPressed(null);
			} else {
				setTimeoutId(setTimeout(() => {
					console.log('fail timeout');1
					setLate(x => x + 1);
					setKeyPressed(null);
					setCounter(x => x + 1);
				}, delay));
	
				setTargetKey(items[Math.floor(Math.random() * items.length)]);
				setKeyPressed(null);
			}
		}

		if (counter !== -1)
			window.addEventListener("keydown", keyPressHandler2);
		else 
			window.removeEventListener("keydown", keyPressHandler2);
		
		return () => {
			window.removeEventListener("keydown", keyPressHandler2);
		};
	}, [counter]);

	return (
		<div class={style.profile}>
			<button onClick={onStartClick}>Start</button>
			<h1>Counter: {counter}</h1>
			<h3>hit: {hit}</h3>
			<h3>miss: {miss}</h3>
			<h3>late: {late}</h3>
			<div class={style.grid}>
				{items.map((x, index) => {
					let c = '';
					if (keyPressed === null && targetKey !== null && x === targetKey){
						c = style.selected;
					} else if (keyPressed !== null && targetKey !== null && keyPressed !== targetKey && keyPressed === x) {
						c = style.missed;
					}
					return (
						<div class={c} key={index}>
							<svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
								<g class={style['base-timer-circle']}>
									<circle class={style['base-timer-path-elapsed']} cx="50" cy="50" r="45" />
								</g>
							</svg>
						</div>
					)
				})}
			</div>
		</div>
	);
}
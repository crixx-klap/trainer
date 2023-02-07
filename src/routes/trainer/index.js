import { useCallback, useEffect, useState } from 'preact/hooks';
import style from './style.module.css';

// Note: `user` comes from the URL, courtesy of our router
export default function Trainer({ user }) {
	const randomCountdown = () => Math.random() > 0.7 ? 500 : 2500;
	
	const [keyPressed, setKeyPressed] = useState();
	const [targetKey, setTargetKey] = useState();
	const [timeoutId, setTimeoutId] = useState(0);
	const [counter, setCounter] = useState(0);
	const [countdown, setCountdown] = useState(randomCountdown());

	const items = [
		'3', '6', '9', '=',
		'2', '5', '8', '-',
		'1', '4', '7', '0'
	];

	const onStartClick = () => {
		setCounter(0);
		startCountDown();
	}

	const startCountDown = () => {
		if (counter > 5) {
			setCounter(0);
			clearTimeout(timeoutId);
			return;
		}
		console.log('countdown starting for the next item');
		console.log(counter)
		setTargetKey(items[Math.floor(Math.random() * items.length)]);
		setCounter(x => x + 1);
		setTimeoutId(setTimeout(() => { 
			console.log('fail timeout');
			//onStartClick();
		}, 3000));
	}

	const keyPressHandler2 = ({ key }) =>{
		console.log('key press handler');
		console.log(timeoutId);
		console.log(targetKey);
		console.log(counter);
		clearTimeout(timeoutId);
		if(targetKey === key){
			console.log('hit', targetKey, key);
		} else {
			console.log('miss', targetKey, key);
		}
		setKeyPressed(key);
		startCountDown();
	};

	useEffect(() => {
		console.log('use effect');
		window.addEventListener("keydown", keyPressHandler2);
		return () => {
			window.removeEventListener("keydown", keyPressHandler2);
		};
	}, [counter]);

	return (
		<div class={style.profile}>
			<button onClick={onStartClick}>Start</button>
			<h1>Counter: {counter}</h1>
			<div class={style.grid}>
				{items.map((x, index) => {
					return <div class={(x === targetKey ? style.selected : "")} key={index}>{x}</div>
				})}
			</div>
		</div>
	);
}
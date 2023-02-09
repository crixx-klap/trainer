import { useCallback, useEffect, useState } from 'preact/hooks';
import style from './style.module.css';

// Note: `user` comes from the URL, courtesy of our router
export default function Trainer({ user }) {
	const randomCountdown = () => Math.random() > 0.7 ? 700 : 2500;
	const waitingForInput = "waitingForInput";
	const paused = "paused";
	const matched = "matched";
	const missed = "missed";
	const timeout = "timeout";


	const [keyPressed, setKeyPressed] = useState(null);
	const [targetKey, setTargetKey] = useState(null);
	const [timeoutId, setTimeoutId] = useState(0);
	const [counter, setCounter] = useState(0);
	const [hit, setHit] = useState(0);
	const [miss, setMiss] = useState(0);
	const [late, setLate] = useState(0);
	const [status, setStatus] = useState(paused);

	const delay = 1000;
	const delayInS = '--duration: 1s;';
	const numberOfRuns = 30;

	const items = [
		'3', '6', '9', '=',
		'2', '5', '8', '-',
		'1', '4', '7', '0'
	];

	const items2 = [
		'q', 'w', 'e', 'r',
		'a', 's', 'd', 'f',
		'y', 'x', 'c', 'v'
	];

	useEffect(()=>{
		console.log("run once")
		window.addEventListener("keydown", keyPressHandler2);
		return () => {
			window.removeEventListener("keydown", keyPressHandler2);
		};
	}, []);

	const onStartClick = () => {
		setStatus(waitingForInput);
		setCounter(0);
		setHit(0);
		setMiss(0);
		setLate(0);
	}

	useEffect(()=>{
		console.log(status, counter);
		
		if (status === waitingForInput) {
			setTargetKey(items[Math.floor(Math.random() * items.length)]);
			setTimeoutId(setTimeout(() => {
				setStatus(timeout);
			}, delay));
		} else if (status === paused) {
			clearTimeout(timeoutId);
			setTargetKey(undefined);
		} else {
			clearTimeout(timeoutId);
			
			if (status === matched) {
				setHit(x => x + 1);
			} else if (status === missed) {
				setMiss(x => x + 1);
			} else if (status === timeout) {
				setLate(x => x + 1);
			}
			if (counter + 1 >= numberOfRuns) {
				setStatus(paused);
			} else {
				setStatus(waitingForInput);
				setCounter(c => c + 1);
			}
		} 
	}, [status]);

	const keyPressHandler2 = (e) =>{
		setKeyPressed(e);
	};

	useEffect(()=>{
		if (status !== waitingForInput)
			return;

		console.log(keyPressed)

		if (keyPressed.key === targetKey) {
			setStatus(matched);
		} else {
			setStatus(missed);
		}
	}, [keyPressed]);


	return (
		<div class={style.profile}>
			<button onClick={onStartClick}>Start</button>
			<h1>Status: {status}</h1>
			<h3>hit: {hit}</h3>
			<h3>miss: {miss}</h3>
			<h3>late: {late}</h3>
			<div class={style.grid}>
				{items.map((x, index) => {
					let c;
					if (status === waitingForInput && targetKey === items[index]) {
						c = style.circle;
					}
					let m;
					if (status === missed && keyPressed.key === items[index]) {
						m = style.missed;
					}
					return (
						<div class={m} key={index}>
							{c ? 
							<svg width="100%" viewBox="0 0 100 100" className={c} style={delayInS}>
								<circle cx="50" cy="50" r="40" stroke="#428bca" stroke-width="6" fill="#555" />
							</svg> : 
							<svg width="100%" viewBox="0 0 100 100">
								<circle cx="50" cy="50" r="40" stroke="#333" stroke-width="6" fill="#333" />
							</svg>}
						</div>
					)
				})}
			</div>
		</div>		
	);
}
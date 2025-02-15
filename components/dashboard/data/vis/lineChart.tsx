import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import styles from './lineChart.module.css';

const LineChart = ({
	data,
	min = 0,
	max = 100,
}: {
	data: number[];
	min: number;
	max: number;
}) => {
	const ref = useRef<HTMLDivElement>(null);

	function init() {
		if (!ref.current) return;

		const margin = { top: 10, right: 20, bottom: 25, left: 25 };

		const fullHeight = ref.current.clientHeight,
			fullWidth = ref.current.clientWidth;

		const height = fullHeight - margin.top - margin.bottom,
			width = ref.current.clientWidth - margin.left - margin.right;

		ref.current.innerHTML = '';

		const svg = d3
			.select(ref.current)
			.append('svg')
			.attr('preserveAspectRatio', 'none')
			.attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`);

		const axisPadding = 5;

		const x = d3.scaleLinear().domain([1, data.length]).range([0, width]);
		const y = d3
			.scaleLinear()
			.domain([min - axisPadding, max + axisPadding])
			.range([height, 0]);

		const xyData: [number, number][] = data.map((d, i) => [x(i + 1), y(d)]);

		const xAxis = d3.axisBottom(x).ticks(data.length);
		const yAxis = d3.axisLeft(y).ticks(5);

		const frame = svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const yA = frame.append('g').attr('class', 'y axis').call(yAxis);
		const xA = frame
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);

		const line = d3.line().curve(d3.curveMonotoneX);

		const path = frame
			.append('path')
			.datum(xyData)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 1.5)
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('d', line);
	}

	useEffect(() => {
		init();
		window.addEventListener('resize', init);
	}, []);

	return (
		<>
			<div className={`${styles.linechart}`} ref={ref}></div>
		</>
	);
};

export default LineChart;

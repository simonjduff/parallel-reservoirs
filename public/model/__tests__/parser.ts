import Parser from '../parser'
import Inlet from '../inlet'
import PipeSeg from '../pipeSeg'
import Splitter from '../splitter'

describe('readFile', () => {
	it('should read a .yml input file', () => {
		const parser = new Parser()
		const data = parser.readFile(`${__dirname}/inputFiles/inletAndPipeSeg.yml`)

		const expected = {
			instructions: [
				{ inlet: { name: 'start', physical: { elevation: 0 } } },
				{
					pipeseg: {
						name: 'pipe1',
						diameters: [1, 2, 3, 4],
						elevation: 0,
						length: 200,
					},
				},
			],
		}

		expect(data).toEqual(expected)
	})
})

describe('build from .yml', () => {
	it('should create a simple network', () => {
		const parser = new Parser()
		parser.readFile(`${__dirname}/inputFiles/inletAndPipeSeg.yml`)
		const root = parser.build()

		expect(root).toBeInstanceOf(Inlet)
		expect((root as Inlet).destination).toBeInstanceOf(PipeSeg)
	})

	it('should create a more complex network (twosplit)', () => {
		const parser = new Parser()
		parser.readFile(`${__dirname}/inputFiles/twosplit.yml`)
		const root = parser.build()

		expect(root).toBeInstanceOf(Inlet)
		expect((root as Inlet).destination).toBeInstanceOf(PipeSeg)
		expect(((root as Inlet).destination as PipeSeg).destination).toBeInstanceOf(
			Splitter
		)
		expect(
			(((root as Inlet).destination as PipeSeg).destination as Splitter)
				.destinations[0]
		).toBeInstanceOf(PipeSeg)
		expect(
			(
				(((root as Inlet).destination as PipeSeg).destination as Splitter)
					.destinations[0] as PipeSeg
			).destination
		).toBeInstanceOf(Splitter)
	})

	it('should create a more complex network (series)', () => {
		const parser = new Parser()
		parser.readFile(`${__dirname}/inputFiles/twosplit.yml`)
		const root = parser.build()

		expect(root).toBeInstanceOf(Inlet)
		expect((root as Inlet).destination).toBeInstanceOf(PipeSeg)
		expect(((root as Inlet).destination as PipeSeg).destination).toBeInstanceOf(
			Splitter
		)
		expect(
			(((root as Inlet).destination as PipeSeg).destination as Splitter)
				.destinations[0]
		).toBeInstanceOf(PipeSeg)
		expect(
			(
				(((root as Inlet).destination as PipeSeg).destination as Splitter)
					.destinations[0] as PipeSeg
			).destination
		).toBeInstanceOf(Splitter)
	})
})

describe('build from .genkey', () => {
	const parser = new Parser()
	parser.readFile(`${__dirname}/inputFiles/pipeTooLong.genkey`, true)
	const root = parser.build()

	const pipe1 = (root as Inlet).destination as PipeSeg
	const pipe2 = (pipe1 as PipeSeg).destination as PipeSeg
	const pipe3 = (pipe2 as PipeSeg).destination as PipeSeg
	const pipe4 = (pipe3 as PipeSeg).destination as PipeSeg
	const pipe5 = (pipe4 as PipeSeg).destination as PipeSeg
	const pipe6 = (pipe5 as PipeSeg).destination as PipeSeg
	const pipe7 = (pipe6 as PipeSeg).destination as PipeSeg

	it('should create a pipeseries when the length would be too long for one pipeseg', () => {
		expect(pipe1.physical.length).toBe(200)
		expect(pipe2.physical.length).toBe(200)
		expect(pipe3.physical.length).toBeCloseTo(70.2239)
		expect(pipe4.physical.length).toBe(200)
	})

	it('should elevate the pipe segments appropriately', () => {
		expect(pipe1.physical.elevation).toBe(14.51)
		expect(pipe2.physical.elevation).toBe(19.0759)
		expect(pipe3.physical.elevation).toBe(23.6417)
		expect(pipe4.physical.elevation).toBe(25.25)
		expect(pipe5.physical.elevation).toBe(22.4129)
		expect(pipe6.physical.elevation).toBe(19.5758)
		expect(pipe7.physical.elevation).toBe(16.7387)
	})
})

// describe('build hynet', () => {
// 	const parser = new Parser()
// 	const fileNames = [
// 		'DG-HM',
// 		'DG-HN',
// 		'DG-LX12in',
// 		'DG-LX14in',
// 		'DG-LX16in',
// 		'POA',
// 	]
// 	for (let filename of fileNames) {
// 		parser.readFile(`${__dirname}/inputFiles/hynet/${filename}.genkey`, true)
// 	}
// 	const root = parser.build()

// 	it('should', () => {
// 		expect(root).toBeInstanceOf(Inlet)
// 	})
// })

import Fluid from './fluid'
import IElement, { IPhysicalElement, PressureSolution } from './element'
import Transport from './transport'
import { defaultFluidConstructor } from './fluid'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities'

export default class Inlet extends Transport {
	fluid: Fluid | null
	destination: IElement | null
	temperature: number = 10

	constructor(name: string, physical: IPhysicalElement) {
		super(name, physical, 'Inlet')

		this.fluid = null
		this.destination = null
	}

	async applyInletProperties(
		pressure: number,
		temperature: number,
		flowrate: number,
		skipProcess = false
	) {
		const newFluid = await defaultFluidConstructor(
			new Pressure(pressure, PressureUnits.Pascal),
			new Temperature(temperature, TemperatureUnits.Kelvin),
			new Flowrate(flowrate, FlowrateUnits.Kgps)
		)

		this.fluid = newFluid
		this.temperature = this.fluid.temperature

		if (skipProcess) return
		return this.process(this.fluid)
	}

	async searchInletPressure() {
		const lowLimit = new Pressure(5, PressureUnits.Bara)
		const highLimit = new Pressure(140, PressureUnits.Bara)

		let low = lowLimit.pascal
		let high = highLimit.pascal
		let mid = 0

		const stepSize = 0.001
		let guesses = 0
		const maxGuesses = 25

		let pressureSolution = PressureSolution.Low

		if (!this.fluid) {
			throw new Error(`Inlet has no fluid`)
		}

		while (pressureSolution !== PressureSolution.Ok) {
			if (guesses++ > maxGuesses) {
				console.log(`max guesses (${maxGuesses}) reached`)
				break
			}

			mid = (low + high) / 2

			console.log({ guesses, inletP: mid, flowrate: this.fluid.flowrate })

			pressureSolution = (await this.applyInletProperties(
				mid,
				this.temperature,
				this.fluid.flowrate
			)) as PressureSolution

			if (pressureSolution === PressureSolution.Low) {
				high = mid - stepSize
			} else if (pressureSolution === PressureSolution.High) {
				low = mid + stepSize
			}
		}

		return { pressure: mid, pressureSolution }
	}

	setDestination(dest: IElement) {
		this.destination = dest
		dest.source = this
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		if (!this.destination) return PressureSolution.Ok

		return await this.destination.process(fluid)
	}
}

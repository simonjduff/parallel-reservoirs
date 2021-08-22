import Page from '@/components/page'
import DashboardGrid from '@/components/dashboard/grid/dashboardGrid'
import GridSpace from '@/components/dashboard/grid/gridspace'
import NumberInput from '@/components/numberInput'
import Button from '@/components/button'
import HyNetTable from '@/components/dashboard/hynetTable'
import dynamic from 'next/dynamic'

const Cyto = dynamic(() => import('@/components/vis/cyto/cyto'), { ssr: false })

const heading = (text) => <h3 className='text-lg font-semibold mb-4'>{text}</h3>

const Vis = () => (
	<Page fullWidth noPadding>
		<DashboardGrid>
			<GridSpace>
				{heading('input')}
				<div>
					<NumberInput label='flowrate' unitListType='flowrate' />
				</div>
				<div className='mt-2'>
					<Button />
				</div>
			</GridSpace>
			<GridSpace cols={2}>
				<Cyto />
			</GridSpace>
			<GridSpace fullWidth>
				<HyNetTable />
			</GridSpace>
		</DashboardGrid>
	</Page>
)

export default Vis

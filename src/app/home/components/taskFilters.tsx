import useUpdateSearchParams from '@/hooks/useUpdateSearchParams'
import { useSearchParams } from 'next/navigation'

const TaskFilters = () => {
	const [updateSearchParams] = useUpdateSearchParams()
	const searchParams = useSearchParams()

	const status = searchParams.get('status') || 'all'

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		updateSearchParams({ status: e.target.value })
	}

	return (
		<div className='my-2 flex gap-5'>
			<div className='flex gap-2'>
				<label className='flex items-center gap-1' htmlFor='status'>
					Status:
				</label>
				<select
					onChange={handleStatusChange}
					name='status'
					id='status'
					className='border border-slate-800 px-2 rounded'
					value={status}
				>
					<option value='all'>All</option>
					<option value='pending'>Pending</option>
					<option value='in-progress'>In Progress</option>
					<option value='completed'>Completed</option>
				</select>
			</div>
		</div>
	)
}

export default TaskFilters

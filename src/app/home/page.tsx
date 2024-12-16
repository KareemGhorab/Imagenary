import Link from 'next/link'
import { IoAdd } from 'react-icons/io5'
import TasksView from './components/tasksView'

const HomePage = () => {
	return (
		<div>
			<TasksView />
			<Link href={'/home/task'} className='absolute right-3 bottom-3 border-2 rounded-full p-4 animate-bounce border-slate-800'>
				<IoAdd size={60} />
			</Link>
		</div>
	)
}

export default HomePage

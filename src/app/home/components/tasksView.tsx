'use client'

import Loading from '@/components/loading'
import { auth, db } from '@/config/firebase'
import { QueryKeys } from '@/enums'
import { Task } from '@/types'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiLoaderAlt } from 'react-icons/bi'
import { useQuery } from 'react-query'
import TaskCard from './taskCard'

const TasksView = () => {
	const [user, userLoading, userError] = useAuthState(auth)

	const tasksQuery = query(
		collection(db, 'tasks'),
		where('assignedTo', '==', user?.email)
	)

	const { data, isLoading: loadingTasks } = useQuery({
		queryKey: [QueryKeys.GetTasks, user?.email],
		enabled: !!user,
		queryFn: () => getDocs(tasksQuery).then((data) => data.docs),
	})

	const tasks = (data || []).map(
		(doc) => ({ id: doc.id, ...doc.data() } as Task)
	)

	return (
		<div>
			<h2 className='bold text-lg mb-3'>Your current tasks:</h2>
			{userLoading || loadingTasks ? (
				<BiLoaderAlt size={60} />
			) : userError ? (
				<p className='text-red-500'>Error Retrieving User Tasks</p>
			) : !tasks.length? <div className='min-h-screen flex items-center justify-center'>
				<p>No tasks found</p>
			</div> : (
				<section className='flex flex-wrap gap-8'>
					{tasks.map((task) => (
						<article key={task.id}>
							<Link href={`/home/task/${task.id}`}>
								<TaskCard
									imageUrl={task.imageUrl}
									status={task.status}
									title={task.title}
								/>
							</Link>
						</article>
					))}
				</section>
			)}
		</div>
	)
}

export default TasksView

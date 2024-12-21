'use client'

import { auth, db } from '@/config/firebase'
import { Task } from '@/types'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiLoaderAlt } from 'react-icons/bi'
import TaskCard from './taskCard'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TaskFilters from './taskFilters'

const TasksView = () => {
	const [user, userLoading, userError] = useAuthState(auth)
	const [tasks, setTasks] = useState<Task[]>([])
	const [loadingTasks, setLoadingTasks] = useState<boolean>(false)

	const searchParams = useSearchParams()

	const status = searchParams.get('status') || 'all'

	const tasksQuery = query(
		collection(db, 'tasks'),
		where('assignedTo', '==', user?.email),
		...(status !== 'all' ? [where('status', '==', status)] : [])
	)

	useEffect(() => {
		setLoadingTasks(true)
		if (!user?.email) return
		const unsubscribe = onSnapshot(tasksQuery, (doc) => {
			const newTasksData = (doc.docs || []).map(
				(doc) => ({ id: doc.id, ...doc.data() } as Task)
			)
			if (!newTasksData) return
			setTasks(newTasksData)
			setLoadingTasks(false)
		})
		return () => unsubscribe()
	}, [user, status])

	return (
		<div>
			<h2 className='bold text-lg mb-3'>Your current tasks:</h2>
			<TaskFilters />
			{userLoading || loadingTasks ? (
				<BiLoaderAlt size={60} className='animate-spin' />
			) : userError ? (
				<p className='text-red-500'>Error Retrieving User Tasks</p>
			) : !tasks.length ? (
				<div className='min-h-[70vh] flex items-center justify-center'>
					<p>No tasks found</p>
				</div>
			) : (
				<section className='flex flex-wrap gap-8'>
					{tasks.map((task) => (
						<article key={task.id}>
							<Link href={`/home/task/${task.id}`}>
								<TaskCard
									rectangles={task.rectangles}
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

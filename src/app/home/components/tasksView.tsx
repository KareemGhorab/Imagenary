'use client'

import { auth, db } from '@/config/firebase'
import { QueryKeys } from '@/enums'
import { Task } from '@/types'
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiLoaderAlt } from 'react-icons/bi'
import { useQuery } from 'react-query'
import TaskCard from './taskCard'
import { useEffect, useState } from 'react'

const TasksView = () => {
	const [user, userLoading, userError] = useAuthState(auth)
	const [tasks, setTasks] = useState<Task[]>([])
	const [loadingTasks, setLoadingTasks] = useState<boolean>(false)

	const tasksQuery = query(
		collection(db, 'tasks'),
		where('assignedTo', '==', user?.email)
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
	}, [user])

	return (
		<div>
			<h2 className='bold text-lg mb-3'>Your current tasks:</h2>
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

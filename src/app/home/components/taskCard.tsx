import { TaskStatus } from '@/types'
import Image from 'next/image'
import { FC } from 'react'
import StatusTag from './statusTag'

type Props = {
	title: string
	imageUrl: string
	status: TaskStatus
}

const TaskCard: FC<Props> = ({ imageUrl, status, title }) => {
	return (
		<div className='flex flex-col gap-3 items-center border-gray-800 border rounded-lg p-10 w-[300px] h-[300px]'>
			<h3>{title}</h3>
			<Image src={imageUrl} alt={title} className='w-[250px] h-[100px]' />
			<StatusTag status={status} />
		</div>
	)
}

export default TaskCard

import { TaskStatus } from '@/types'
import clsx from 'clsx'
import { FC } from 'react'

type Props = {
	status: TaskStatus
}

const StatusTag: FC<Props> = ({ status }) => {
	return (
		<div
			className={clsx('px-4 py-2 rounded-full text-white', {
				'bg-red-400': status === 'pending',
				'bg-green-400': status === 'completed',
				'bg-orange-400 ': status === 'in-progress',
			})}
		>
			{status[0].toUpperCase() + status.slice(1)}
		</div>
	)
}

export default StatusTag

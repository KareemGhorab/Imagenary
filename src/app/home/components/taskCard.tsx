import { Rectangle, TaskStatus } from '@/types'
import { FC, useEffect, useRef } from 'react'
import StatusTag from './statusTag'
import { drawRectangles } from '@/helpers'
import { HEIGHT, WIDTH } from '@/consts'

type Props = {
	title: string
	imageUrl: string
	status: TaskStatus
	rectangles: Rectangle[]
}

const TaskCard: FC<Props> = ({ imageUrl, status, title, rectangles }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = WIDTH
		canvas.height = HEIGHT

		const img = new Image()
		img.src = imageUrl
		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
			drawRectangles(ctx, rectangles)
		}
	}, [])

	return (
		<div className='flex flex-col gap-3 items-center border-gray-800 border rounded-lg p-10 w-[300px] h-[350px]'>
			<h3>{title}</h3>
			<canvas ref={canvasRef} className='w-[250px] h-[187.5px]' />
			<StatusTag status={status} />
		</div>
	)
}

export default TaskCard

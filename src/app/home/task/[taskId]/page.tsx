'use client'

import Button from '@/components/button'
import Loading from '@/components/loading'
import { db } from '@/config/firebase'
import { doc, updateDoc } from 'firebase/firestore' // Import updateDoc
import Link from 'next/link'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'

type Props = { params: { taskId: string } }

interface Point {
	x: number
	y: number
}

interface Rectangle extends Point {
	width: number
	height: number
	annotation?: string
}

const TaskPage = ({ params: { taskId } }: Props) => {
	const taskRef = doc(db, 'tasks', taskId)
	const [taskSnapshot, loading, error] = useDocument(taskRef)

	const taskData = taskSnapshot?.data()

	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const [rectangles, setRectangles] = useState<Rectangle[]>([])
	const [startPoint, setStartPoint] = useState<Point | null>(null)
	const [backgroundImage, setBackgroundImage] =
		useState<HTMLImageElement | null>(null)
	const [annotationInput, setAnnotationInput] = useState<string>('')
	const [selectedRectangleIndex, setSelectedRectangleIndex] = useState<
		number | null
	>(null)
	const [status, setStatus] = useState<string>('')

	useEffect(() => {
		if (!taskData?.imageUrl || backgroundImage) return
		const img = document.createElement('img')

		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = 800
		canvas.height = 600
		img.src = taskData.imageUrl
		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
			setBackgroundImage(img)

			const loadedRectangles = taskData.rectangles || []
			setRectangles(loadedRectangles)
			drawRectangles(ctx, loadedRectangles)
		}

		if (taskData?.status) {
			setStatus(taskData.status)
		} else {
			setStatus('pending')
		}
	}, [taskData, backgroundImage])

	const drawRectangles = (
		ctx: CanvasRenderingContext2D,
		rectangles: Rectangle[]
	) => {
		rectangles.forEach((rect) => {
			ctx.strokeStyle = 'red'
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)

			if (rect.annotation) {
				ctx.fillStyle = 'black'
				ctx.font = '16px Arial'
				ctx.fillText(rect.annotation, rect.x + 5, rect.y - 5)
			}
		})
	}

	const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) return

		const rect = canvasRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		setStartPoint({ x, y })
		setIsDrawing(true)
	}

	const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
		if (!isDrawing || !startPoint || !backgroundImage || !canvasRef.current)
			return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
		rectangles.forEach((rect) => {
			ctx.strokeStyle = 'red'
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
		})

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		const width = x - startPoint.x
		const height = y - startPoint.y

		ctx.strokeStyle = 'blue'
		ctx.strokeRect(startPoint.x, startPoint.y, width, height)
	}

	const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
		if (!startPoint || !canvasRef.current) return

		const rect = canvasRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		const newRectangle: Rectangle = {
			x: startPoint.x,
			y: startPoint.y,
			width: x - startPoint.x,
			height: y - startPoint.y,
		}

		setRectangles((prev) => [...prev, newRectangle])
		setIsDrawing(false)
		setSelectedRectangleIndex(rectangles.length)
	}

	const handleAddAnnotation = () => {
		if (selectedRectangleIndex === null) return
		const updatedRectangles = [...rectangles]
		updatedRectangles[selectedRectangleIndex].annotation = annotationInput
		setRectangles(updatedRectangles)
		setAnnotationInput('')
		setSelectedRectangleIndex(null)
		const canvas = canvasRef.current
		if (canvas) {
			const ctx = canvas.getContext('2d')
			if (ctx) drawRectangles(ctx, updatedRectangles)
		}
	}

	const handleSaveAnnotations = async () => {
		try {
			await updateDoc(taskRef, {
				rectangles: rectangles,
			})
			toast('Annotations saved successfully', {
				type: 'success',
				theme: 'colored',
			})
		} catch (error) {
			console.error('Error saving annotations:', error)
			toast('Failed to save annotations.', {
				type: 'error',
				theme: 'colored',
			})
		}
	}

	const handleStatusChange = async (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const newStatus = event.target.value
		setStatus(newStatus)
		try {
			await updateDoc(taskRef, {
				status: newStatus,
			})
			toast('Status updated successfully', {
				type: 'success',
				theme: 'colored',
			})
		} catch (error) {
			console.error('Error updating status:', error)
			toast('Failed to update status.', {
				type: 'error',
				theme: 'colored',
			})
		}
	}

	if (loading) return <Loading />
	if (error) return <p>Error: {error.message}</p>

	return (
		<div className='relative'>
			<Link href='/home' className='absolute top-3 left-3'>
				<FaArrowLeft size={40} />
			</Link>
			<h2 className='text-center bold text-3xl'>{taskData?.title}</h2>
			<canvas
				ref={canvasRef}
				className='border border-slate-800 rounded-lg mx-auto my-5'
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			></canvas>
			{selectedRectangleIndex !== null && (
				<div className='mt-4'>
					<input
						type='text'
						value={annotationInput}
						onChange={(e) => setAnnotationInput(e.target.value)}
						placeholder='Enter annotation'
						className='border rounded p-2'
					/>
					<Button onClick={handleAddAnnotation}>
						Add Annotation
					</Button>
				</div>
			)}
			<div className='flex gap-5 flex-col items-center'>
				<div>
					<label htmlFor='status'>Status: </label>
					<select value={status} onChange={handleStatusChange}>
						<option value='pending'>Pending</option>
						<option value='in-progress'>In Progress</option>
						<option value='completed'>Completed</option>
					</select>
				</div>
				<Button
					onClick={handleSaveAnnotations}
					className=''
					variant='secondary'
				>
					Save Annotations
				</Button>
			</div>
		</div>
	)
}

export default TaskPage

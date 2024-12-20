'use client'

import Button from '@/components/button'
import Loading from '@/components/loading'
import { db } from '@/config/firebase'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'
import { Point, Rectangle } from '@/types'
import { drawRectangles, resetCanvas } from '@/helpers'
import { useMutation } from 'react-query'
import { useRouter } from 'next/navigation'
import { HEIGHT, WIDTH } from '@/consts'

type Props = { params: { taskId: string } }

const TaskPage = ({ params: { taskId } }: Props) => {
	const taskRef = doc(db, 'tasks', taskId)
	const [taskSnapshot, loading, error] = useDocument(taskRef)

	const taskData = taskSnapshot?.data()

	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const ctx = canvasRef.current?.getContext('2d')!
	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const [rectangles, setRectangles] = useState<Rectangle[]>([])
	const [startPoint, setStartPoint] = useState<Point | null>(null)
	const [backgroundImage, setBackgroundImage] =
		useState<HTMLImageElement | null>(null)
	const [annotationInput, setAnnotationInput] = useState<string>('')
	const [showAnnotationInput, setShowAnnotationInput] =
		useState<boolean>(false)
	const [status, setStatus] = useState<string>('')
	const [annotationsToUndo, setAnnotationsToUndo] = useState<number>(0)
	const router = useRouter()

	useEffect(() => {
		if (!taskData?.imageUrl || backgroundImage) return
		const img = document.createElement('img')

		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = WIDTH
		canvas.height = HEIGHT
		img.src = taskData.imageUrl
		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
			setBackgroundImage(img)

			const loadedRectangles = taskData.rectangles || []
			setRectangles(loadedRectangles)
			drawRectangles(ctx, loadedRectangles)
		}

		setStatus(taskData.status || 'pending')

		
	}, [taskData, backgroundImage])


	useEffect(() => {
		const unsubscribe = onSnapshot(taskRef, (doc) => {
			const newTaskData = doc.data()
			if (!newTaskData) return

			setStatus(newTaskData.status || 'pending')

			const updatedRectangles = newTaskData.rectangles || []
			setRectangles(updatedRectangles)

			if (backgroundImage) {
				resetCanvas(ctx, backgroundImage)
				drawRectangles(ctx, updatedRectangles)
			}
		})

		return () => unsubscribe()
	}, [])

	const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) return

		const rect = canvasRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		setStartPoint({ x, y })
		setIsDrawing(true)
	}

	const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) return

		const rect = canvasRef.current.getBoundingClientRect()
		const x = e.touches[0].clientX - rect.left
		const y = e.touches[0].clientY - rect.top

		setStartPoint({ x, y })
		setIsDrawing(true)
	}

	const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
		if (!isDrawing || !startPoint || !backgroundImage || !canvasRef.current)
			return

		const canvas = canvasRef.current

		resetCanvas(ctx, backgroundImage)
		drawRectangles(ctx, rectangles)

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		const width = x - startPoint.x
		const height = y - startPoint.y

		ctx.strokeStyle = 'blue'
		ctx.strokeRect(startPoint.x, startPoint.y, width, height)
	}

	const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault()
		if (!isDrawing || !startPoint || !backgroundImage || !canvasRef.current)
			return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		resetCanvas(ctx, backgroundImage)
		drawRectangles(ctx, rectangles)

		const rect = canvas.getBoundingClientRect()
		const x = e.touches[0].clientX - rect.left
		const y = e.touches[0].clientY - rect.top
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
		setShowAnnotationInput(true)
		setAnnotationsToUndo((prev) => prev + 1)
	}

	const handleTouchEnd = (e: TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault()
		if (!startPoint || !canvasRef.current) return

		const rect = canvasRef.current.getBoundingClientRect()
		const x = e.changedTouches[0].clientX - rect.left
		const y = e.changedTouches[0].clientY - rect.top

		const newRectangle: Rectangle = {
			x: startPoint.x,
			y: startPoint.y,
			width: x - startPoint.x,
			height: y - startPoint.y,
		}

		setRectangles((prev) => [...prev, newRectangle])
		setIsDrawing(false)
		setShowAnnotationInput(true)
		setAnnotationsToUndo((prev) => prev + 1)
	}

	const handleAddAnnotation = () => {
		if (!showAnnotationInput) return

		setRectangles((prev) => {
			prev[prev.length - 1].annotation = annotationInput
			const canvas = canvasRef.current
			if (canvas) {
				const ctx = canvas.getContext('2d')
				if (ctx) drawRectangles(ctx, prev)
			}
			return prev
		})

		setAnnotationInput('')
		setShowAnnotationInput(false)
	}

	const { mutate: resetAnnotations, isLoading: loadingResetAnnotations } =
		useMutation({
			mutationFn: () => {
				setRectangles([])
				const canvas = canvasRef.current!
				ctx.clearRect(0, 0, canvas.width, canvas.height)
				ctx.drawImage(
					backgroundImage!,
					0,
					0,
					canvas.width,
					canvas.height
				)
				setShowAnnotationInput(false)
				return updateDoc(taskRef, { rectangles: [] })
			},
			onSuccess: () => {
				toast('Annotations reset successfully', {
					type: 'success',
					theme: 'colored',
				})
			},
			onError: () => {
				toast('Failed to reset annotations.', {
					type: 'error',
					theme: 'colored',
				})
			},
		})

	const { mutate: saveAnnotation, isLoading: loadingSaveAnnotation } =
		useMutation({
			mutationFn: () => {
				setShowAnnotationInput(false)
				return updateDoc(taskRef, { rectangles: rectangles })
			},
			onSuccess: () => {
				toast('Annotations saved successfully', {
					type: 'success',
					theme: 'colored',
				})
				setAnnotationsToUndo(0)
				router.push('/home')
			},
			onError: () => {
				toast('Failed to save annotations.', {
					type: 'error',
					theme: 'colored',
				})
			},
		})

	const handleUndoAnnotation = () => {
		if (annotationsToUndo < 1) return
		setAnnotationsToUndo((prev) => {
			return prev - 1
		})
		setRectangles((prev) => {
			const rects = prev.slice(0, prev.length - 1)
			resetCanvas(ctx, backgroundImage!)
			drawRectangles(ctx, rects)
			return rects
		})
		setShowAnnotationInput(false)
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
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			></canvas>
			{showAnnotationInput ? (
				<div className='mt-4 fixed bottom-8 left-8 border rounded p-2 border-slate-800 animate-bounce'>
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
			) : null}
			<div className='flex gap-5 flex-col items-center'>
				<div>
					<label htmlFor='status'>Status: </label>
					<select value={status} onChange={handleStatusChange}>
						<option value='pending'>Pending</option>
						<option value='in-progress'>In Progress</option>
						<option value='completed'>Completed</option>
					</select>
				</div>
				<div className='flex flex-col gap-1'>
					{annotationsToUndo > 0 ? (
						<Button
							onClick={handleUndoAnnotation}
							className='w-44 h-10'
							variant='primary'
							loading={loadingResetAnnotations}
						>
							Undo Annotation
						</Button>
					) : null}
					<Button
						onClick={() => resetAnnotations()}
						className='w-44 h-10'
						variant='primary'
						loading={loadingResetAnnotations}
					>
						Reset Annotations
					</Button>
				</div>
				<Button
					onClick={() => saveAnnotation()}
					className='w-44 h-10'
					variant='secondary'
					loading={loadingSaveAnnotation}
				>
					Save Annotations
				</Button>
			</div>
		</div>
	)
}

export default TaskPage

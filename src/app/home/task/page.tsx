'use client'

import Button from '@/components/button'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'
import { CldUploadWidget } from 'next-cloudinary'
import { toast } from 'react-toastify'
import { taskSVC } from '@/service/api'
import { useRouter } from 'next/navigation'

type TaskFormInputs = {
	title: string
	image: FileList
	assigneeEmail: string
}

const NewTaskPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TaskFormInputs>()
	const router = useRouter()

	const { mutate, isLoading } = useMutation({
		mutationFn: ({
			title,
			image,
			assignedTo,
		}: {
			title: string
			image: File
			assignedTo: string
		}) => taskSVC.createTask(title, image, assignedTo),
		onSuccess: () => {
			toast('Task created successfully', {
				position: 'top-right',
				type: 'success',
				theme: 'colored',
			})
			router.push('/home')
		},
	})

	const onSubmit: SubmitHandler<TaskFormInputs> = (data) => {
		mutate({
			title: data.title,
			image: data.image[0],
			assignedTo: data.assigneeEmail,
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='max-w-md mx-auto bg-white p-6 shadow-md rounded-md'
		>
			<div className='mb-4'>
				<label
					htmlFor='title'
					className='block text-sm font-medium text-gray-700'
				>
					Title
				</label>
				<input
					id='title'
					type='text'
					{...register('title', { required: 'Title is required' })}
					className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
				/>
				{errors.title && (
					<p className='mt-1 text-sm text-red-500'>
						{errors.title.message}
					</p>
				)}
			</div>

			<div className='mb-4'>
				<label
					htmlFor='image'
					className='block text-sm font-medium text-gray-700'
				>
					Image
				</label>
				<input
					id='image'
					type='file'
					accept='image/*'
					{...register('image', { required: 'Image is required' })}
					className='mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500'
				/>
				{errors.image && (
					<p className='mt-1 text-sm text-red-500'>
						{errors.image.message}
					</p>
				)}
			</div>

			<div className='mb-4'>
				<label
					htmlFor='assigneeEmail'
					className='block text-sm font-medium text-gray-700'
				>
					Assignee Email
				</label>
				<input
					id='assigneeEmail'
					type='email'
					{...register('assigneeEmail', {
						required: 'Assignee email is required',
					})}
					className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
				/>
				{errors.assigneeEmail && (
					<p className='mt-1 text-sm text-red-500'>
						{errors.assigneeEmail.message}
					</p>
				)}
			</div>

			<Button type='submit' className='w-full '>
				Create Task
			</Button>
		</form>
	)
}

export default NewTaskPage

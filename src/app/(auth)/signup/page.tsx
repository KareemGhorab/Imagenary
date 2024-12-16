'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/config/firebase'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Input from '@/components/input'
import Button from '@/components/button'

type TFormInputs = {
	email: string
	password: string
}

const Signup = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TFormInputs>()

	const router = useRouter()
	const [createUserWithEmailAndPassword] =
		useCreateUserWithEmailAndPassword(auth)

	const { mutate: createUser } = useMutation({
		mutationFn: ({ email, password }: TFormInputs) =>
			createUserWithEmailAndPassword(email, password),
		onSuccess: () => {
			toast('Account Created Successfully', {
				position: 'top-right',
				theme: 'colored',
				type: 'success',
			})
			router.push('/')
		},
	})

	const onSubmit = (data: TFormInputs) => {
		createUser(data)
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-200'>
			<div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
				<h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>
					Sign Up
				</h2>
				<form
					className='space-y-4'
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'
						>
							Email Address
						</label>
						<input
							type='email'
							id='email'
							placeholder='you@example.com'
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
									message: 'Invalid email address',
								},
							})}
							className={`mt-1 block w-full px-3 py-2 border ${
								errors.email
									? 'border-red-500'
									: 'border-gray-300'
							}`}
						/>
						{errors.email && (
							<p className='text-sm text-red-500 mt-1'>
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'
						>
							Password
						</label>
						<input
							type='password'
							id='password'
							placeholder='••••••••'
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 8,
									message:
										'Password must be at least 8 characters',
								},
							})}
							className={`mt-1 block w-full px-3 py-2 border ${
								errors.password
									? 'border-red-500'
									: 'border-gray-300'
							}`}
						/>
						{errors.password && (
							<p className='text-sm text-red-500 mt-1'>
								{errors.password.message}
							</p>
						)}
					</div>

					<Button type='submit' className='w-full'>
						Sign Up
					</Button>
				</form>

				<p className='text-sm text-gray-600 text-center mt-4'>
					Already have an account?{' '}
					<Link href='/signin' className='underline'>
						Login here
					</Link>
				</p>
			</div>
		</div>
	)
}

export default Signup

'use client'

import { PropsWithChildren, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/config/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Button from '@/components/button'
import styles from './auth.module.css'
import clsx from 'clsx'

const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, userLoading, userError] = useAuthState(auth)
	const router = useRouter()
	const [users, usersLoading, usersError] = useCollection(
		collection(db, 'users')
	)

	useEffect(() => {
		if (!user || !users) return
		if (users.docs.find((u) => u.data().email === user.email)) return

		addDoc(collection(db, 'users'), {
			email: user.email,
			tasks: [],
		})

		try {
		} catch (error: any) {
			toast(error.message || 'Unexpected Error', {
				position: 'top-right',
				theme: 'colored',
				type: 'error',
			})
		}
	}, [user, users])

	if (userLoading || usersLoading) return <></>

	if (userError || usersError) {
		toast('Error With User Authentication, Please Try Again Later', {
			position: 'top-right',
			theme: 'colored',
			type: 'error',
		})
		router.replace('/signin')
	}

	if (!user) return <>{children}</>

	return (
		<div>
			<header
				className={clsx(
					'flex p-8 items-center border-b',
					styles['auth-header']
				)}
			>
				<h1 className='bold text-2xl'>Image Annotation</h1>
				<p className='flex'>
					You are currently logged in as: {user?.email}
				</p>
				<Button onClick={() => signOut(auth)} variant='secondary'>
					Log Out
				</Button>
			</header>
			{children}
		</div>
	)
}

export default AuthProvider

'use client'

import Loading from '@/components/loading'
import { auth } from '@/config/firebase'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiLoaderAlt } from 'react-icons/bi'
import { toast } from 'react-toastify'

const AuthLayout = ({ children }: PropsWithChildren) => {
	const [user, userLoading, userError] = useAuthState(auth)
	const router = useRouter()

	if (userLoading) return <Loading />

	if (userError) {
		toast('Error With User Authentication, Please Try Again Later', {
			position: 'top-right',
			theme: 'colored',
			type: 'error',
		})
		return <></>
	}

	if (user) {
		router.replace('/home')
	}

	return <div>{children}</div>
}

export default AuthLayout

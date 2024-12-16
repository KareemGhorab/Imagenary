'use client'

import Loading from '@/components/loading'
import { auth } from '@/config/firebase'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const HomeLayout = ({ children }: PropsWithChildren) => {
	const [user, userLoading] = useAuthState(auth)
	const router = useRouter()

	if (userLoading) return <Loading />

	if (!user) {
		router.replace('/signin')
		return <></>
	}

	return <div className='p-8'>{children}</div>
}

export default HomeLayout

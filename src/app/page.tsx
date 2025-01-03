'use client'

import Loading from '@/components/loading'
import { auth } from '@/config/firebase'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'

const Page = () => {
	const router = useRouter()
	const [user, userLoading] = useAuthState(auth)

	if (userLoading) return <Loading />

	if (user) {
		router.replace('/home')
	} else {
		router.replace('/signin')
	}

	return <Loading />
}

export default Page

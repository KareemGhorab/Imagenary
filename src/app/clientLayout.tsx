'use client'

import AuthProvider from '@/providers/authProvider'
import QueryProvider from '@/providers/queryProvider'
import { PropsWithChildren } from 'react'

const ClientLayout = ({ children }: PropsWithChildren) => {
	return (
		<div>
			<QueryProvider>
				<AuthProvider>{children}</AuthProvider>
			</QueryProvider>
		</div>
	)
}

export default ClientLayout

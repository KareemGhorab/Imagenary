import { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { toast } from 'react-toastify'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			onError: (error: any) => {
				toast(error.message || 'Unexpected Error', {
					position: 'top-right',
					theme: 'colored',
					type: 'error',
				})
			},
		},
		mutations: {
			onError: (error: any) => {
				toast(error.message || 'Unexpected Error', {
					position: 'top-right',
					theme: 'colored',
					type: 'error',
				})
			},
		},
	},
})

const QueryProvider = ({ children }: PropsWithChildren) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	)
}

export default QueryProvider

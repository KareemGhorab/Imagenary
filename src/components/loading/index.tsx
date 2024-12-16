import { BiLoaderAlt } from 'react-icons/bi'

const Loading = () => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-200'>
			<BiLoaderAlt size={50} className='animate-spin' />
		</div>
	)
}

export default Loading

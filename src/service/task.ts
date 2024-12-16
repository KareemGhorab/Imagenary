import { db } from '@/config/firebase'
import { AxiosInstance } from 'axios'
import { addDoc, collection } from 'firebase/firestore'

const task = (api: AxiosInstance) => ({
	createTask: async (title: string, image: File, assignedTo: string) => {
		const formData = new FormData()
		formData.append('file', image)
		formData.append(
			'upload_preset',
			process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
		)

		const cloudinaryData = await api
			.post(
				`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
				formData
			)
			.then((response) => response.data)

		const imageUrl = cloudinaryData.secure_url

		await addDoc(collection(db, 'tasks'), {
			title,
			assignedTo,
			imageUrl,
			rectangles: [],
			status: 'pending',
			annotations: [],
		})
	},
})

export default task

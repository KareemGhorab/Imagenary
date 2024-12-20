export type TaskStatus = 'pending' | 'in-progress' | 'completed'

export type Task = {
	id: string
	title: string
	imageUrl: string
	assignedTo: string
	status: TaskStatus
	annotations: {
		rectangles: {
			x: number
			y: number
			width: number
			height: number
			annotation: string
		}[]
	}[]
}

export type User = {
	email: string
	tasks: string[]
}


export type Point = {
	x: number
	y: number
}

export type Rectangle = Point & {
	width: number
	height: number
	annotation?: string
}
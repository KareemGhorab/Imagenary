type Props = { params: { taskId: string } }

const TaskPage = ({ params: { taskId } }: Props) => {
	return <div>{taskId}</div>
}

export default TaskPage

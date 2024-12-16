import clsx from 'clsx'

import styles from './index.module.css'

type Props = {
	name: string
	type?: 'text' | 'password' | 'email'
} & React.HtmlHTMLAttributes<HTMLInputElement>

const Input: React.FC<Props> = ({ className, type, ...props }) => (
	<input
		type={type}
		{...props}
		className={clsx(styles.control, 'py-1', className)}
	/>
)

export default Input

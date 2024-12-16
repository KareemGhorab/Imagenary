import clsx from 'clsx'

import styles from './index.module.css'

type Props = {
	name: string
	type?: 'text' | 'password' | 'email'
	placeholder?: string
} & React.HtmlHTMLAttributes<HTMLInputElement>

const Input: React.FC<Props> = ({ className, type, placeholder, ...props }) => (
	<input
		type={type}
		{...props}
		placeholder={placeholder}
		className={clsx(
			styles.control,
			' border-2 border-primary-400 px-2 w-full focus:outline-none transition-all duration-200 py-1',
			className
		)}
	/>
)

export default Input

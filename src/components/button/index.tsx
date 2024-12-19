import clsx from 'clsx'

import styles from './index.module.css'
import { ReactNode } from 'react'
import { BiLoaderAlt } from 'react-icons/bi'

type Props = {
	variant?: 'primary' | 'secondary'
	type?: 'submit' | 'button'
	rounded?: boolean
	children?: ReactNode
	loading?: boolean
} & React.HtmlHTMLAttributes<HTMLButtonElement>

const Button: React.FC<Props> = ({
	variant = 'primary',
	type,
	rounded = false,
	loading = false,
	children,
	...props
}) => {
	return (
		<button
			type={type}
			disabled={loading}
			{...props}
			className={clsx(
				'text-xl flex justify-center items-center text-center',
				{
					'border-2 border-primary-400 bg-white text-primary-400 hover:bg-slate-800 hover:text-white hover:border-primary-400':
						variant === 'primary',
					'border-2 border-primary-400 bg-slate-800 text-white hover:bg-white hover:text-slate-800':
						variant === 'secondary',
					'rounded-full p-2': rounded,
					[styles.btn]: !rounded,
					'px-3 py-1': !rounded,
				},
				props.className
			)}
		>
			{loading ? <BiLoaderAlt size={20} /> : children}
		</button>
	)
}

export default Button

import type { Metadata } from 'next'
import { Neucha } from 'next/font/google'
import './globals.css'

const neucha = Neucha({ weight: ['400'], subsets: ['cyrillic'] })

export const metadata: Metadata = {
	title: 'Imagenary',
	description: 'Imagenary is an image annotation app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={neucha.className}>{children}</body>
		</html>
	)
}

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const useUpdateSearchParams = () => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	const updateSearchParams = (newParams: { [key: string]: string }) => {
		const currentParams = new URLSearchParams(searchParams.toString())
		Object.entries(newParams).forEach(([key, value]) => {
			if (value) currentParams.set(key, value)
			else currentParams.delete(key)
		})
		const newPathname = `${pathname}?${currentParams.toString()}`
		router.replace(newPathname, { scroll: false })
	}

	return [updateSearchParams]
}

export default useUpdateSearchParams

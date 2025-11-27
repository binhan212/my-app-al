import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center gap-2 mt-8">
      {pages.map((page) => (
        <Link key={page} href={`${basePath}?page=${page}`}>
          <Button
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
          >
            {page}
          </Button>
        </Link>
      ))}
    </div>
  )
}

export interface PaginationOptions {
  page?: number
  limit?: number
  maxLimit?: number
}

export interface PaginationResult {
  offset: number
  limit: number
  page: number
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export function calculatePagination(options: PaginationOptions): PaginationResult {
  const page = Math.max(1, options.page || 1)
  const maxLimit = options.maxLimit || 100
  const limit = Math.min(maxLimit, Math.max(1, options.limit || 10))
  const offset = (page - 1) * limit

  return { offset, limit, page }
}

export function createPaginationMeta(totalItems: number, currentPage: number, itemsPerPage: number): PaginationMeta {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

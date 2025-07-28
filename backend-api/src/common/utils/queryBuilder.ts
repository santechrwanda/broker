import { Op } from "sequelize"

export interface SearchOptions {
  search?: string
  searchFields?: string[]
}

export interface FilterOptions {
  [key: string]: any
}

export interface SortOptions {
  sortBy?: string
  sortOrder?: "ASC" | "DESC"
  defaultSort?: [string, "ASC" | "DESC"]
}

export function buildSearchClause(options: SearchOptions): any {
  if (!options.search || !options.searchFields?.length) {
    return {}
  }

  return {
    [Op.or]: options.searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${options.search}%` },
    })),
  }
}

export function buildFilterClause(filters: FilterOptions): any {
  const whereClause: any = {}

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        whereClause[key] = { [Op.in]: value }
      } else {
        whereClause[key] = value
      }
    }
  })

  return whereClause
}

export function buildSortClause(options: SortOptions): [string, "ASC" | "DESC"][] {
  const order: [string, "ASC" | "DESC"][] = []

  if (options.sortBy) {
    order.push([options.sortBy, options.sortOrder || "ASC"])
  }

  if (options.defaultSort) {
    order.push(options.defaultSort)
  }

  return order.length > 0 ? order : [["createdAt", "DESC"]]
}

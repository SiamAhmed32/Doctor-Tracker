export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function buildPagination(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

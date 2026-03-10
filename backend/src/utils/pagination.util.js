// Pagination Utility

const paginationUtil = (page, limit, total) => {
  // Convert to number
  const currentPage = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  // Calculate total pages
  const totalPages = Math.ceil(total / limitNumber);

  // Calculate next and previous page
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;

  // Return pagination object
  return {
    currentPage,
    nextPage,
    previousPage,
    totalPages,
  };
};

module.exports = paginationUtil;
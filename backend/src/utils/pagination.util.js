const paginationUtil = (page, limit, total) => {
  const currentPage = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const totalPages = Math.ceil(total / limitNumber);

  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;

  return {
    currentPage,
    nextPage,
    previousPage,
    totalPages,
  };
};

module.exports = paginationUtil;
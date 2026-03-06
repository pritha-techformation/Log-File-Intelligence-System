const paginationUtil = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = page ? page : 1;
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

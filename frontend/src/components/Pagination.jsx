export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = [];
  const addPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    if (!pages.includes(page)) {
      pages.push(page);
    }
  };

  addPage(1);
  addPage(currentPage - 1);
  addPage(currentPage);
  addPage(currentPage + 1);
  addPage(totalPages);

  pages.sort((a, b) => a - b);

  const items = [];
  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    const prev = pages[i - 1];
    if (prev && page - prev > 1) {
      items.push({ type: "ellipsis", key: `gap-${prev}` });
    }
    items.push({ type: "page", value: page, key: page });
  }

  return (
    <div className="flex justify-center gap-3 py-6">
      <button
        type="button"
        className="px-3 py-1 rounded-md border border-black disabled:opacity-40"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Predošlá
      </button>

      {items.map((item) => {
        if (item.type === "ellipsis") {
          return (
            <span key={item.key} className="px-3 py-1">
              ...
            </span>
          );
        }

        const isActive = item.value === currentPage;
        return (
          <button
            key={item.key}
            type="button"
            className={
              isActive
                ? "px-3 py-1 bg-black text-white rounded-md"
                : "px-3 py-1 rounded-md border border-black"
            }
            onClick={() => onPageChange(item.value)}
          >
            {item.value}
          </button>
        );
      })}

      <button
        type="button"
        className="px-3 py-1 rounded-md border border-black disabled:opacity-40"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Ďalšia
      </button>
    </div>
  );
}

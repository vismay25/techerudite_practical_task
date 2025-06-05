import React, { useState, useEffect } from "react";
import Select from "react-select";

const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "books", label: "Books" },
  { value: "clothing", label: "Clothing" },
];

function ProductList({ products, onDelete }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const itemsPerPage = 5;

  const filtered = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      product.categories.some((cat) =>
        selectedCategories.find((sel) => sel.value === cat.value)
      );
    return matchesName && matchesCategory;
  });

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    setPage(1); // Reset page when filters change
  }, [search, selectedCategories, products]);

  return (
    <div>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <Select
          isMulti
          options={categoryOptions}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>

      <ul className="list-group mb-3">
        {paginated.map((product) => (
          <li key={product.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{product.name}</strong> — {product.quantity} pcs
                <div className="mt-1">
                  {product.categories.map((cat) => (
                    <span key={cat.value} className="badge bg-secondary me-1">
                      {cat.label}
                    </span>
                  ))}
                </div>
                <small className="text-muted">
                  Added: {new Date(product.createdAt).toLocaleDateString()}
                </small>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              className={`page-item ${page === i + 1 ? "active" : ""}`}
              key={i}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default ProductList;

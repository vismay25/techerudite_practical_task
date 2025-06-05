import React, { useEffect, useState } from "react";
import Select from "react-select";
import { fetchCategories } from "../utils/api";

function ProductGrid({
  products,
  onDelete,
  filters,
  setFilters,
  page,
  setPage,
  totalPages,
}) {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        const options = res.data.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategoryOptions(options);
      } catch {
        setCategoryOptions([]);
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      {/* Filters Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="col-md-6">
          <Select
            isMulti
            options={categoryOptions}
            value={filters.categories}
            onChange={(selected) =>
              setFilters({ ...filters, categories: selected || [] })
            }
            placeholder="🎯 Filter by categories"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="row">
        {products.length === 0 ? (
          <div className="text-center text-muted">No products found.</div>
        ) : (
          products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.description || "No description"}
                  </p>
                  <p className="card-subtitle mb-2 text-muted">
                    Quantity: {product.quantity}
                  </p>

                  <div className="mb-2">
                    {product.categories.map((cat) => (
                      <span key={cat._id} className="badge bg-primary me-1">
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  <small className="text-muted mt-auto">
                    Added on: {new Date(product.createdAt).toLocaleDateString()}
                  </small>

                  <button
                    className="btn btn-outline-danger btn-sm mt-3"
                    onClick={() => onDelete(product._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
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
    </>
  );
}

export default ProductGrid;

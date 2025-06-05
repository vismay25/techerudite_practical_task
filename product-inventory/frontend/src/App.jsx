import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./components/ProductForm";
import ProductGrid from "./components/ProductGrid";
import { fetchProducts, createProduct, deleteProduct } from "./utils/api";

function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ search: "", categories: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts({
        page,
        search: filters.search,
        categories: filters.categories.map((c) => c.value),
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Error loading products");
    }
  };

  useEffect(() => {
    if (!showForm) {
      loadProducts();
    }
  }, [page, filters, showForm]);

  const handleAddProduct = async (productData) => {
    try {
      await createProduct(productData);
      toast.success("Product added successfully");
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-center flex-grow-1">🛒 Product Inventory</h2>
        <button
          className={`btn ${
            showForm ? "btn-outline-secondary" : "btn-success"
          }`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "➕ Add Product"}
        </button>
      </div>

      {showForm ? (
        <ProductForm onAdd={handleAddProduct} />
      ) : (
        <ProductGrid
          products={products}
          onDelete={handleDeleteProduct}
          filters={filters}
          setFilters={setFilters}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

export default App;

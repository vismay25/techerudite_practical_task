import React, { useEffect, useState } from "react";
import Select from "react-select";
import { fetchCategories } from "../utils/api";

function ProductForm({ onAdd }) {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    categories: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        const options = res.data.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategoryOptions(options);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategoryOptions([]);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setError("Product name is required");
    if (form.quantity <= 0)
      return setError("Quantity must be greater than zero");
    if (form.categories.length === 0)
      return setError("Please select at least one category");

    setError("");

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      quantity: form.quantity,
      categories: form.categories.map((c) => c.value),
    };

    onAdd(productData);

    setForm({ name: "", description: "", quantity: 0, categories: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h5 className="mb-3">🆕 Add a New Product</h5>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        className="form-control mb-3"
        placeholder="Description"
        rows={3}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Quantity"
        min={0}
        value={form.quantity}
        onChange={(e) =>
          setForm({
            ...form,
            quantity: Math.max(0, parseInt(e.target.value) || 0),
          })
        }
      />

      <Select
        isMulti
        options={categoryOptions}
        value={form.categories}
        onChange={(selected) =>
          setForm({ ...form, categories: selected || [] })
        }
        placeholder="Select Categories"
      />

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <button type="submit" className="btn btn-primary mt-3">
        Add Product
      </button>
    </form>
  );
}

export default ProductForm;

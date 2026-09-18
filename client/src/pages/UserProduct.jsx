import { useEffect, useState } from "react";
import userApi from "../services/userApi";

const emptyForm = { name: "", price: "", description: "" };

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await userApi.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Could not load products.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
      };

      if (editingId) {
        await userApi.put(`/products/${editingId}`, payload);
      } else {
        await userApi.post("/products", payload);
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
    });
  };

  const handleDelete = async (id) => {
    try {
      await userApi.delete(`/products/${id}`);
      await loadProducts();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Could not delete product.");
    }
  };

  return (
    <div className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Fresh catalog</p>
        <h1>My Grocery Products</h1>
        <p>Add, update, and manage the products in your store inventory.</p>
      </section>

      <div className="profile-grid">
        <section className="form-card">
          <div className="section-header">
            <h3>{editingId ? "Update product" : "Add new product"}</h3>
            {editingId && (
              <button type="button" className="secondary-button small" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          {error && <p className="alert error">{error}</p>}

          <form onSubmit={handleSubmit} className="user-form">
            <label>
              Product name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Price
              <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" required />
            </label>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows="4" required />
            </label>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </form>
        </section>

        <section className="product-panel panel">
          <div className="panel-header">
            <h3>Inventory</h3>
            <span>{filteredProducts.length} items</span>
          </div>

          <div className="search-box-wrap">
            <input
              type="text"
              className="search-box"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="product-grid">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">No products match your search. Try another term.</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">🥬</div>
                  <h4>{product.name}</h4>
                  <div className="product-price">Rs. {Number(product.price).toFixed(2)}</div>
                  <p>{product.description}</p>

                  <div className="product-actions">
                    <button type="button" className="secondary-button small" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button type="button" className="danger-button small" onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProducts;


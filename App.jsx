
import { useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", category: "Electronics", price: 45000, stock: 15 },
    { id: 2, name: "Keyboard", category: "Accessories", price: 800, stock: 5 },
    { id: 3, name: "Mouse", category: "Accessories", price: 400, stock: 25 },
    { id: 4, name: "Monitor", category: "Electronics", price: 8000, stock: 2 },
    { id: 5, name: "Headphones", category: "Electronics", price: 1500, stock: 12 },
  ]);

  const [sales, setSales] = useState(0);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const stockValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.category.trim() ||
        form.price === "" || form.stock === "") {
      alert("Please fill all fields");
      return;
    }

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      alert("Price and stock cannot be negative");
      return;
    }

    if (editId !== null) {
      setProducts(products.map((p) =>
        p.id === editId
          ? {
              ...p,
              ...form,
              price: Number(form.price),
              stock: Number(form.stock),
            }
          : p
      ));
    } else {
      setProducts([
        ...products,
        {
          id: Date.now(),
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
      ]);
    }

    closeForm();
  }

  function closeForm() {
    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
    });
    setEditId(null);
    setFormOpen(false);
  }

  function handleEdit(product) {
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });
    setEditId(product.id);
    setFormOpen(true);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  }

  function updateStock(id, amount) {
    const product = products.find((p) => p.id === id);

    if (!product || product.stock + amount < 0) return;

    setProducts(products.map((p) =>
      p.id === id ? { ...p, stock: p.stock + amount } : p
    ));

    if (amount < 0) {
      setSales(sales + Math.abs(amount));
    }
  }

  function money(value) {
    return "₹" + value.toLocaleString("en-IN");
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>📦 StockFlow</h2>
        <p className="menu-label">MAIN MENU</p>

        <a href="#dashboard" className="active">📊 Dashboard</a>
        <a href="#products">📦 Products</a>
        <a href="#reports">📈 Reports</a>

        <div className="sidebar-footer">
          Inventory Management System
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* HEADER */}
        <header className="header" id="dashboard">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your Inventory Management System</p>
          </div>
          <div className="admin">👤 Admin</div>
        </header>

        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card blue">
            <span>Total Products</span>
            <h2>{products.length}</h2>
            <p>Products registered</p>
          </div>

          <div className="stat-card green">
            <span>Total Stock</span>
            <h2>{totalStock}</h2>
            <p>Units available</p>
          </div>

          <div className="stat-card orange">
            <span>Low Stock</span>
            <h2>{lowStock}</h2>
            <p>Products need restocking</p>
          </div>

          <div className="stat-card purple">
            <span>Stock Value</span>
            <h2>{money(stockValue)}</h2>
            <p>Current inventory value</p>
          </div>

        </section>

        {/* SALES SUMMARY */}
        <section className="sales-card" id="reports">
          <div>
            <h3>Stock Out / Sales Overview</h3>
            <p>Total units removed from stock in this session</p>
          </div>
          <h2>{sales} Units</h2>
        </section>

        {/* PRODUCT SECTION */}
        <section className="product-section" id="products">

          <div className="section-header">
            <div>
              <h2>Product Management</h2>
              <p>Manage your inventory products</p>
            </div>

            <button className="add-btn" onClick={() => setFormOpen(true)}>
              + Add Product
            </button>
          </div>

          {/* PRODUCT FORM */}
          {formOpen && (
            <form className="product-form" onSubmit={handleSubmit}>
              <h3>{editId !== null ? "Update Product" : "Add New Product"}</h3>

              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />

              <input
                name="price"
                type="number"
                min="0"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
              />

              <input
                name="stock"
                type="number"
                min="0"
                placeholder="Quantity"
                value={form.stock}
                onChange={handleChange}
              />

              <button type="submit" className="add-btn">
                {editId !== null ? "Update Product" : "Save Product"}
              </button>

              <button type="button" className="cancel-btn" onClick={closeForm}>
                Cancel
              </button>
            </form>
          )}

          {/* SEARCH */}
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search products by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* PRODUCT TABLE */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Stock In / Out</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category}</td>
                    <td>{money(p.price)}</td>
                    <td>{p.stock}</td>

                    <td>
                      <span className={p.stock <= 5 ? "low" : "available"}>
                        {p.stock <= 5 ? "Low Stock" : "Available"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="stock-in"
                        onClick={() => updateStock(p.id, 1)}
                      >
                        + In
                      </button>

                      <button
                        className="stock-out"
                        disabled={p.stock === 0}
                        onClick={() => updateStock(p.id, -1)}
                      >
                        - Out
                      </button>
                    </td>

                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(p)}>
                        Edit
                      </button>

                      <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

        <footer>
          Inventory Management System © 2026
        </footer>

      </main>
    </div>
  );
}

export default App;

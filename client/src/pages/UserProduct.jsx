import { useEffect, useState } from "react";
import userApi from "../services/userApi";

const UserProducts = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const response = await userApi.get("/products");

      setProducts(response.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);

      loadProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>My Products</h2>

      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>

          <p>{product.price}</p>

          <p>{product.description}</p>

          <button>
            Edit
          </button>

          <button
            onClick={() => handleDelete(product._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserProducts;


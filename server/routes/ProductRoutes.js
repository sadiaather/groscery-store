import express from "express";

import {
  createProduct,
  getMyProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controller/ProductController.js";

import { authentication } from "../middlewear/AuthMiddlewear.js";

const router = express.Router();

router.post("/",authentication, createProduct);

router.get("/", authentication, getMyProducts);

router.get("/:id", authentication, getSingleProduct);

router.put("/:id", authentication, updateProduct);

router.delete("/:id", authentication, deleteProduct);

export default router;

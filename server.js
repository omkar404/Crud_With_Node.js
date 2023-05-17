const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const connection = require('./config/db.config');
app.set("view engine","ejs")

const port = process.env.PORT || 5000;

app.use(bodyparser.urlencoded({ extended: true   }))

app.use(bodyparser.json())

app.get("/", (req, res) => {
    res.render("home");
  });
  
  app.get("/products", (req, res) => {
    let sql = "SELECT * FROM products";
    connection.query(sql, (err, rows) => {
      res.render("index", {
        title: "PRODUCTS",
        users: rows,
        category: rows,
      });
    });
  });
  
  app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    let sql = `DELETE FROM products WHERE ProductId=${id}`;
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
  
  app.get("/remove/:id", (req, res) => {
    const id = req.params.id;
    let sql = `DELETE FROM categories WHERE CategoryId=${id}`;
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
  
  app.get("/change/:id", (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM categories WHERE CategoryId=${id}`;
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.render("editCategory", {
        title: "Update Category",
        user: rows[0],
      });
    });
  });
  
  app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM products WHERE ProductId=${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render("editProduct", {
        title: "Update the Product",
        user: result[0],
      });
    });
  });
  
  app.post("/update", (req, res) => {
    const Id = req.body.ProductId;
    let sql = `UPDATE products SET ProductName='${req.body.ProductName}', CategoryName='${req.body.CategoryName}', CategoryId='${req.body.CategoryId}' WHERE ProductId=${Id}`;
    connection.query(sql, (err, results) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
  
  app.post("/modify", (req, res) => {
    const Id = req.body.CategoryId;
    const name = req.body.CategoryName;
    let sql = `UPDATE categories SET CategoryName='${name}' WHERE CategoryId=${Id}`;
    connection.query(sql, (err, results) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
  
  app.get("/categories", (req, res) => {
    const pageSize = req.query.pageSize || 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * pageSize;
    const sql = `SELECT * FROM categories LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.render("categories", {
        title: "CATEGORIES",
        category: rows,
      });
    });
  });
  
  app.get("/categories/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM products WHERE CategoryId=${id}`;
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.render("index", {
        title: "Related Products",
        users: rows,
      });
    });
  });
  
  
    // add a new category
    app.post("/categories", (req, res) => {
      const { categoryId, categoryName } = req.body;
      const sql = `INSERT INTO categories (CategoryId, CategoryName) VALUES (${categoryId}, '${categoryName}')`;
      connection.query(sql, (error, results) => {
        if (error) throw error;
        res.send("Category added successfully");
      });
    });
    // /categories/delete/6
    app.post("/categories/delete/:id", (req, res) => {
      const id = req.params.id;
      let sql = `delete FROM categories where CategoryId=${id}`;
      let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.redirect("/");
      });
    });
    // get all products with pagination, including category name and category id
    app.get("/products", (req, res) => {
      const pageSize = req.query.pageSize || 10; // default page size is 10
      const page = req.query.page || 1; // default page is 1
      const offset = (page - 1) * pageSize;
      const sql = `SELECT products.ProductId, products.ProductName, categories.CategoryId, categories.CategoryName
                  FROM products INNER JOIN categories ON products.CategoryId = categories.CategoryId
                  LIMIT ${pageSize} OFFSET ${offset}`;
      connection.query(sql, (error, results) => {
        if (error) throw error;
        res.send(results);
      });
    });
  
    // add a new product
    app.post("/categories", (req, res) => {
      const { categoryId, categoryName } = req.body;
      const sql = `INSERT INTO categories (CategoryId, CategoryName) VALUES (${categoryId}, '${categoryName}')`;
      connection.query(sql, (error, results) => {
        if (error) throw error;
        res.send("Category added successfully");
      });
    });
    
    app.post("/categories/delete/:id", (req, res) => {
      const id = req.params.id;
      const sql = `DELETE FROM categories WHERE CategoryId=${id}`;
      connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.redirect("/");
      });
    });
    
    app.get("/products", (req, res) => {
      const pageSize = req.query.pageSize || 10;
      const page = req.query.page || 1;
      const offset = (page - 1) * pageSize;
      const sql = `SELECT products.ProductId, products.ProductName, categories.CategoryId, categories.CategoryName
                  FROM products INNER JOIN categories ON products.CategoryId = categories.CategoryId
                  LIMIT ${pageSize} OFFSET ${offset}`;
      connection.query(sql, (error, results) => {
        if (error) throw error;
        res.send(results);
      });
    });
    
    app.post("/products", (req, res) => {
      const { productId, productName, categoryId } = req.body;
      const sql = `INSERT INTO products (ProductId, ProductName, CategoryId) VALUES (${productId}, '${productName}', ${categoryId})`;
      connection.query(sql, (error, results) => {
        if (error) throw error;
        res.send("Product added successfully");
      });
    });
    
    app.get("/add/product/", (req, res) => {
      res.render("addProduct", {
        title: "Add Product",
      });
    });
    
    app.get("/add/category/", (req, res) => {
      res.render("addCategory", {
        title: "Add Category",
      });
    });
    
    app.post("/save", (req, res) => {
      const { ProductName, CategoryName, CategoryId } = req.body;
      const sql = `INSERT INTO products (ProductName, CategoryName, CategoryId) VALUES ('${ProductName}', '${CategoryName}', ${CategoryId})`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect("/");
      });
    });
    
    app.post("/save/category", (req, res) => {
      const { CategoryName, CategoryId } = req.body;
      const sql = `INSERT INTO categories (CategoryName, CategoryId) VALUES ('${CategoryName}', ${CategoryId})`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect("/");
      });
    });
 
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  
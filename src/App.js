import React, { useState, useEffect } from "react";
import axios from "axios";



const categories = ["Entertainment", "Technology", "Sports", "Business", "Health", "Science"];

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    blogger_name: "",
    image: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs: ", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.category) {
      errors.category = "Category is required";
      isValid = false;
    }
    if (!formData.title || formData.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
      isValid = false;
    }
    if (!formData.blogger_name || formData.blogger_name.length < 3) {
      errors.blogger_name = "Blogger name must be at least 3 characters";
      isValid = false;
    }
    if (!formData.image) {
      errors.image = "Image URL is required";
      isValid = false;
    }
    if (!formData.description || formData.description.length < 3) {
      errors.description = "Description must be at least 3 characters";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:3000/blogs", formData);
        setFormData({
          category: "",
          title: "",
          blogger_name: "",
          image: "",
          description: "",
        });
        fetchBlogs();
      } catch (error) {
        console.error("Error adding blog: ", error);
      }
    }
  };

  const handleFilter = async (category) => {
    try {
      const response = await axios.get(`http://localhost:3000/blogs?category=${category}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error filtering blogs: ", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Blog List</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category:</label>
              <select className="form-select" name="category" id="category" value={formData.category} onChange={handleChange}>
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-danger">{errors.category}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title:</label>
              <input type="text" className="form-control" name="title" id="title" value={formData.title} onChange={handleChange} />
              {errors.title && <p className="text-danger">{errors.title}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="blogger_name" className="form-label">Blogger Name:</label>
              <input type="text" className="form-control" name="blogger_name" id="blogger_name" value={formData.blogger_name} onChange={handleChange} />
              {errors.blogger_name && <p className="text-danger">{errors.blogger_name}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL:</label>
              <input type="text" className="form-control" name="image" id="image" value={formData.image} onChange={handleChange} />
              {errors.image && <p className="text-danger">{errors.image}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea className="form-control" name="description" id="description" value={formData.description} onChange={handleChange}></textarea>
              {errors.description && <p className="text-danger">{errors.description}</p>}
            </div>
            <button type="submit" className="btn btn-primary">Add Blog</button>
          </form>
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">Filter by Category</h2>
          <ul className="list-group">
            {categories.map((category, index) => (
              <li key={index} className="list-group-item" onClick={() => handleFilter(category)}>
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="mb-3">All Blogs</h2>
        {blogs.map((blog) => (
          <div key={blog.id} className="card mb-3">
            <div className="card-header">{blog.title}</div>
            <div className="card-body">
              <h5 className="card-title">{blog.blogger_name}</h5>
              <img src={blog.image} className="card-img-top" alt={blog.title} />
              <p className="card-text">{blog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

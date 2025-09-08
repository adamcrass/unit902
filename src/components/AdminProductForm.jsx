// src/components/admin/ProductForm.jsx
import React, { useState } from "react";
import styled from "@emotion/styled";

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px ${({ theme }) => theme.colors.shadow};

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 1.5rem 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Button = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant, theme }) => {
    if (variant === "primary") {
      return `
        background: ${theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${theme.colors.primaryLight};
          transform: translateY(-1px);
          box-shadow: 0 4px 8px ${theme.colors.shadow};
        }
      `;
    }
    return `
      background: ${theme.colors.gray200};
      color: ${theme.colors.textPrimary};
      
      &:hover {
        background: ${theme.colors.gray300};
      }
    `;
  }}
`;

const initialProduct = {
  name: "",
  description: "",
  price: "",
  category: "",
  subcategory: "",
  image: "",
  attributes: "",
  inStock: true,
  quantity: "",
};

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Health & Beauty",
  "Automotive",
];

const ProductForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [product, setProduct] = useState(initialData || initialProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert price to cents if it's not already
      const productData = {
        ...product,
        price: parseInt(product.price),
        quantity: parseInt(product.quantity),
      };

      await onSubmit(productData);

      if (!initialData) {
        setProduct(initialProduct);
      }
    } catch (error) {
      // TODO: Implement proper error handling with toast notifications
      alert("Error submitting product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setProduct(initialData || initialProduct);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>
          {initialData ? "Edit Product" : "Add New Product"}
        </FormTitle>

        <FormGrid>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>

            <InputGroup>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="description">Description *</Label>
              <TextArea
                id="description"
                name="description"
                placeholder="Enter product description"
                value={product.description}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={product.image}
                onChange={handleChange}
              />
            </InputGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Pricing & Inventory</SectionTitle>

            <InputGroup>
              <Label htmlFor="price">Price (in cents) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="2999 (for $29.99)"
                value={product.price}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={product.quantity}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <CheckboxGroup>
              <Checkbox
                id="inStock"
                name="inStock"
                type="checkbox"
                checked={product.inStock}
                onChange={handleChange}
              />
              <CheckboxLabel htmlFor="inStock">
                Product is in stock and available
              </CheckboxLabel>
            </CheckboxGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Categorization</SectionTitle>

            <InputGroup>
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                name="subcategory"
                placeholder="Enter subcategory"
                value={product.subcategory}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="attributes">Features/Attributes</Label>
              <Input
                id="attributes"
                name="attributes"
                placeholder="Comma-separated features"
                value={product.attributes}
                onChange={handleChange}
              />
            </InputGroup>
          </FormSection>
        </FormGrid>

        <ButtonGroup>
          <Button type="button" onClick={handleReset}>
            Reset
          </Button>
          {onCancel && (
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Update Product"
                : "Add Product"}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default ProductForm;

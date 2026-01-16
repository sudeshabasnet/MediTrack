import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddEditMedicine = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const isEdit = !!id
  const isSupplier = user?.role === 'SUPPLIER'
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    genericName: '',
    manufacturer: '',
    description: '',
    unitPrice: '',
    currentStock: '',
    minStockLevel: '',
    expiryDate: '',
    batchNumber: '',
    supplierId: '',
    imageUrl: ''
  })
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchCategories()
    if (isEdit) {
      fetchMedicine()
    }
    if (!isSupplier && user?.role === 'ADMIN') {
      fetchSuppliers()
    } else if (isSupplier) {
      setFormData(prev => ({ ...prev, supplierId: user.id }))
    }
  }, [id, user])

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/admin/users/roles/SUPPLIER')
      setSuppliers(response.data)
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories?activeOnly=true')
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const fetchMedicine = async () => {
    try {
      const endpoint = isSupplier 
        ? `/api/supplier/medicines/${id}` 
        : `/api/admin/medicines/${id}`
      const response = await axios.get(endpoint)
      setFormData(response.data)
      if (response.data.imageUrl) {
        setImagePreview(response.data.imageUrl)
      }
    } catch (error) {
      toast.error('Failed to fetch medicine details')
      navigate(isSupplier ? '/supplier/medicines' : '/admin/medicines')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB')
      return
    }

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }))
      setImagePreview(response.data.imageUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        const endpoint = isSupplier 
          ? `/api/supplier/medicines/${id}` 
          : `/api/admin/medicines/${id}`
        await axios.put(endpoint, formData)
        toast.success('Medicine updated successfully')
      } else {
        const endpoint = isSupplier 
          ? '/api/supplier/medicines' 
          : '/api/admin/medicines'
        await axios.post(endpoint, formData)
        toast.success('Medicine added successfully')
      }
      navigate(isSupplier ? '/supplier/medicines' : '/admin/medicines')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const backUrl = isSupplier ? '/supplier/medicines' : '/admin/medicines'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to={isSupplier ? '/supplier/dashboard' : '/admin/dashboard'} className="text-2xl font-bold text-primary-600">
                MediTrack
              </Link>
              <span className="text-sm text-gray-500">
                {isEdit ? 'Edit Medicine' : 'Add New Medicine'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={backUrl}
                className="text-sm text-gray-700 hover:text-primary-600"
              >
                Back to Medicines
              </Link>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isEdit ? 'Edit Medicine' : 'Add New Medicine'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter medicine name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.icon && `${category.icon} `}{category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="genericName" className="block text-sm font-medium text-gray-700 mb-2">
                  Generic Name *
                </label>
                <input
                  id="genericName"
                  name="genericName"
                  type="text"
                  required
                  value={formData.genericName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter generic name"
                />
              </div>

              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer *
                </label>
                <input
                  id="manufacturer"
                  name="manufacturer"
                  type="text"
                  required
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter manufacturer name"
                />
              </div>

              <div>
                <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number *
                </label>
                <input
                  id="batchNumber"
                  name="batchNumber"
                  type="text"
                  required
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter batch number"
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price (Rs.) *
                </label>
                <input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  required
                  value={formData.unitPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock *
                </label>
                <input
                  id="currentStock"
                  name="currentStock"
                  type="number"
                  required
                  value={formData.currentStock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="minStockLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock Level *
                </label>
                <input
                  id="minStockLevel"
                  name="minStockLevel"
                  type="number"
                  required
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {!isSupplier && user?.role === 'ADMIN' && (
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <select
                    id="supplierId"
                    name="supplierId"
                    required
                    value={formData.supplierId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.organizationName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter medicine description"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative w-48 h-48 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {imageUploading && (
                  <p className="text-sm text-gray-500">Uploading image...</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                to={backUrl}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Medicine' : 'Add Medicine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddEditMedicine

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';

const RegisterItemPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerItem } = useItems();
  const { isAuthenticated } = useAuth();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [metadata, setMetadata] = useState<{ key: string; value: string }[]>([
    { key: 'origin', value: '' },
    { key: 'batchNumber', value: '' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Authentication required!</strong>
            <span className="block sm:inline"> You need to connect your wallet to register new items.</span>
          </div>
        </div>
      </Layout>
    );
  }
  
  const addMetadataField = () => {
    setMetadata([...metadata, { key: '', value: '' }]);
  };
  
  const removeMetadataField = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  };
  
  const updateMetadataKey = (index: number, key: string) => {
    const newMetadata = [...metadata];
    newMetadata[index].key = key;
    setMetadata(newMetadata);
  };
  
  const updateMetadataValue = (index: number, value: string) => {
    const newMetadata = [...metadata];
    newMetadata[index].value = value;
    setMetadata(newMetadata);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Convert metadata array to object
      const metadataObject: Record<string, string> = {};
      metadata.forEach(item => {
        if (item.key && item.value) {
          metadataObject[item.key] = item.value;
        }
      });
      
      const itemId = await registerItem({
        name,
        description,
        imageUrl: imageUrl || undefined,
        metadata: metadataObject,
      });
      
      if (itemId) {
        navigate(`/items/${itemId}`);
      } else {
        setError('Failed to register item. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900">Register New Item</h1>
          <p className="mt-2 text-gray-600">
            Add a new item to the blockchain-based supply chain tracker
          </p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Premium Coffee Beans"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="100% Arabica coffee beans from Colombia"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a URL for an image that represents this item
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Metadata
                    </label>
                    <button
                      type="button"
                      onClick={addMetadataField}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      + Add Field
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-3">
                    {metadata.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) => updateMetadataKey(index, e.target.value)}
                          className="w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Key"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => updateMetadataValue(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Value"
                        />
                        <button
                          type="button"
                          onClick={() => removeMetadataField(index)}
                          className="px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          aria-label="Remove field"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Add custom attributes for this item (e.g., origin, batch number, material)
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <PackagePlus className="w-5 h-5 mr-2" />
                    {loading ? 'Registering...' : 'Register Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterItemPage;
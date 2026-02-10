import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useGetAllLookbookImages, useGetAllProducts } from '../hooks/useQueries';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact';

interface LookbookProps {
  onNavigate: (page: Page, productId?: string) => void;
}

export default function Lookbook({ onNavigate }: LookbookProps) {
  const { data: lookbookImages = [], isLoading: lookbookLoading } = useGetAllLookbookImages();
  const { data: allProducts = [], isLoading: productsLoading } = useGetAllProducts();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const isLoading = lookbookLoading || productsLoading;

  const getProductDetails = (productId: string) => {
    return allProducts.find((p) => p.id === productId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl text-gold">Lookbook</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our curated collection of styled looks featuring the finest pieces from our latest collection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lookbookImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg cursor-pointer border border-gold/20 hover:border-gold transition-all duration-300 hover:shadow-xl"
            onClick={() => setSelectedImage(index)}
          >
            <div className="aspect-[4/5]">
              <img
                src={image.image.getDirectURL()}
                alt={image.description}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-6 w-full">
                <p className="text-primary-foreground text-lg mb-2">{image.description}</p>
                {image.taggedProducts.length > 0 && (
                  <p className="text-gold text-sm">
                    {image.taggedProducts.length} {image.taggedProducts.length === 1 ? 'product' : 'products'} featured
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Detail Dialog */}
      {selectedImage !== null && (
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={lookbookImages[selectedImage].image.getDirectURL()}
                alt={lookbookImages[selectedImage].description}
                className="w-full h-auto rounded-lg"
              />
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-gold">{lookbookImages[selectedImage].description}</h2>
                {lookbookImages[selectedImage].taggedProducts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg text-gold">Featured Products</h3>
                    <div className="space-y-2">
                      {lookbookImages[selectedImage].taggedProducts.map((productId) => {
                        const product = getProductDetails(productId);
                        if (!product) return null;
                        return (
                          <div
                            key={productId}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gold/20 hover:border-gold cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedImage(null);
                              onNavigate('product', productId);
                            }}
                          >
                            <img
                              src={product.images[0]?.getDirectURL()}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-serif text-gold">{product.name}</p>
                              <p className="text-sm text-muted-foreground">${Number(product.price).toFixed(2)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

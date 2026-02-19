import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import {
  useGetAllCategories,
  useCreateCategory,
  useUpdateCategoryDescription,
  useDeleteCategory,
  useGetAllProducts,
} from '../../hooks/useQueries';
import type { Category } from '../../backend';
import { parseAdminAuthError } from '../../utils/adminAuthError';

type Page = 'home' | 'catalog' | 'product' | 'cart' | 'wishlist' | 'lookbook' | 'about' | 'contact' | 'admin' | 'admin-products' | 'admin-lookbook' | 'admin-categories' | 'admin-sessions' | 'admin-site-settings' | 'shipping' | 'returns';

interface AdminCategoriesProps {
  onNavigate: (page: Page) => void;
}

type SortField = 'name' | 'count';
type SortOrder = 'asc' | 'desc';

export default function AdminCategories({ onNavigate }: AdminCategoriesProps) {
  const { data: categories = [], isLoading } = useGetAllCategories();
  const { data: products = [] } = useGetAllProducts();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategoryDescription();
  const deleteCategory = useDeleteCategory();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Calculate product counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'count') {
        const countA = categoryCounts[a.name] || 0;
        const countB = categoryCounts[b.name] || 0;
        comparison = countA - countB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [categories, searchTerm, sortField, sortOrder, categoryCounts]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          name: editingCategory.name,
          newDescription: formData.description.trim(),
        });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        toast.success('Category created successfully');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    const productCount = categoryCounts[categoryToDelete.name] || 0;
    if (productCount > 0) {
      toast.error('Cannot delete category', {
        description: `This category has ${productCount} product(s). Please reassign or remove those products first.`,
      });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      return;
    }

    try {
      await deleteCategory.mutateAsync(categoryToDelete.name);
      toast.success('Category deleted successfully');
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      const parsed = parseAdminAuthError(error);
      toast.error(parsed.message, {
        description: parsed.nextSteps,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingCategory(null);
  };

  return (
    <AdminLayout currentPage="admin-categories" onNavigate={onNavigate} title="Category Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground mt-1">
              Manage product categories
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Hajj Essentials"
                    disabled={!!editingCategory}
                  />
                  {editingCategory && (
                    <p className="text-xs text-muted-foreground">
                      Category name cannot be changed. Create a new category if needed.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category"
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCategory.isPending || updateCategory.isPending}
                  >
                    {createCategory.isPending || updateCategory.isPending
                      ? 'Saving...'
                      : editingCategory
                      ? 'Update Category'
                      : 'Create Category'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories ({filteredAndSortedCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
            ) : filteredAndSortedCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No categories found matching your search' : 'No categories yet. Create your first category!'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => toggleSort('name')}
                        className="flex items-center gap-2 hover:text-foreground"
                      >
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>
                      <button
                        onClick={() => toggleSort('count')}
                        className="flex items-center gap-2 hover:text-foreground"
                      >
                        Products
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCategories.map((category) => (
                    <TableRow key={category.name}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-md truncate">
                        {category.description || '—'}
                      </TableCell>
                      <TableCell>{categoryCounts[category.name] || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(category)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the category "{categoryToDelete?.name}"?
                {categoryToDelete && categoryCounts[categoryToDelete.name] > 0 && (
                  <span className="block mt-2 text-destructive font-medium">
                    Warning: This category has {categoryCounts[categoryToDelete.name]} product(s).
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

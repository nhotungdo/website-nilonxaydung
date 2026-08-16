import 'package:flutter/material.dart';

import '../services/product_api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/admin_topbar.dart';

class WebsiteProductsScreen extends StatefulWidget {
  const WebsiteProductsScreen({super.key});

  @override
  State<WebsiteProductsScreen> createState() => _WebsiteProductsScreenState();
}

class _WebsiteProductsScreenState extends State<WebsiteProductsScreen> {
  bool _isLoading = true;
  List<Map<String, dynamic>> _products = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);
    try {
      final data = await ProductApiService.fetchProducts();
      setState(() {
        _products = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi tải sản phẩm: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _deleteProduct(String id, String name) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: Text('Bạn có chắc chắn muốn xóa sản phẩm "$name"?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Hủy')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Xóa'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await ProductApiService.deleteProduct(id);
        _loadProducts();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Đã xóa sản phẩm thành công.'), backgroundColor: Colors.green),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Lỗi xóa sản phẩm: $e'), backgroundColor: Colors.red),
          );
        }
      }
    }
  }

  void _openProductForm([Map<String, dynamic>? product]) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => ProductFormDialog(
        product: product,
        onSaved: () {
          _loadProducts();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _products.where((p) {
      final name = (p['name'] ?? '').toString().toLowerCase();
      final sku = (p['sku'] ?? '').toString().toLowerCase();
      final q = _searchQuery.toLowerCase();
      return name.contains(q) || sku.contains(q);
    }).toList();

    return Column(
      children: [
        AdminTopbar(
          title: 'Quản lý Sản phẩm Website',
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Tìm kiếm sản phẩm (Tên, SKU)...',
                          prefixIcon: const Icon(Icons.search),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        onChanged: (val) => setState(() => _searchQuery = val),
                      ),
                    ),
                    const SizedBox(width: 16),
                    ElevatedButton.icon(
                      onPressed: () => _openProductForm(),
                      icon: const Icon(Icons.add),
                      label: const Text('Thêm Sản Phẩm Mới'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryTeal,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4)),
                      ],
                    ),
                    child: _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : filtered.isEmpty
                            ? const Center(child: Text('Không tìm thấy sản phẩm nào.', style: TextStyle(color: Colors.grey)))
                            : ListView.separated(
                                padding: const EdgeInsets.all(16),
                                itemCount: filtered.length,
                                separatorBuilder: (context, index) => const Divider(height: 1),
                                itemBuilder: (context, index) {
                                  final p = filtered[index];
                                  return ListTile(
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                    leading: Container(
                                      width: 50,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: BorderRadius.circular(8),
                                        image: p['image'] != null && p['image'].toString().isNotEmpty
                                            ? DecorationImage(image: NetworkImage(p['image']), fit: BoxFit.cover)
                                            : null,
                                      ),
                                      child: p['image'] == null || p['image'].toString().isEmpty
                                          ? const Icon(Icons.image_not_supported, color: Colors.grey)
                                          : null,
                                    ),
                                    title: Text(p['name'] ?? 'Không tên', style: const TextStyle(fontWeight: FontWeight.bold)),
                                    subtitle: Text('SKU: ${p['sku']} • Giá: ${p['price']} đ/${p['unit']} • Tồn kho: ${p['stock']}'),
                                    trailing: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.edit_outlined, color: Colors.blue),
                                          onPressed: () => _openProductForm(p),
                                          tooltip: 'Sửa',
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.delete_outline, color: Colors.red),
                                          onPressed: () => _deleteProduct(p['id'], p['name']),
                                          tooltip: 'Xóa',
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class ProductFormDialog extends StatefulWidget {
  final Map<String, dynamic>? product;
  final VoidCallback onSaved;

  const ProductFormDialog({super.key, this.product, required this.onSaved});

  @override
  State<ProductFormDialog> createState() => _ProductFormDialogState();
}

class _ProductFormDialogState extends State<ProductFormDialog> {
  final _formKey = GlobalKey<FormState>();
  bool _isSaving = false;

  late TextEditingController _nameCtrl;
  late TextEditingController _skuCtrl;
  late TextEditingController _slugCtrl;
  late TextEditingController _priceCtrl;
  late TextEditingController _stockCtrl;
  late TextEditingController _unitCtrl;
  late TextEditingController _categoryCtrl;
  late TextEditingController _catSlugCtrl;
  late TextEditingController _imageCtrl;

  @override
  void initState() {
    super.initState();
    final p = widget.product;
    _nameCtrl = TextEditingController(text: p?['name']?.toString() ?? '');
    _skuCtrl = TextEditingController(text: p?['sku']?.toString() ?? '');
    _slugCtrl = TextEditingController(text: p?['slug']?.toString() ?? '');
    _priceCtrl = TextEditingController(text: p?['price']?.toString() ?? '0');
    _stockCtrl = TextEditingController(text: p?['stock']?.toString() ?? '100');
    _unitCtrl = TextEditingController(text: p?['unit']?.toString() ?? 'Cái');
    _categoryCtrl = TextEditingController(text: p?['category']?.toString() ?? '');
    _catSlugCtrl = TextEditingController(text: p?['category_slug']?.toString() ?? '');
    _imageCtrl = TextEditingController(text: p?['image']?.toString() ?? '');
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _skuCtrl.dispose();
    _slugCtrl.dispose();
    _priceCtrl.dispose();
    _stockCtrl.dispose();
    _unitCtrl.dispose();
    _categoryCtrl.dispose();
    _catSlugCtrl.dispose();
    _imageCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    try {
      final data = {
        'name': _nameCtrl.text,
        'sku': _skuCtrl.text,
        'slug': _slugCtrl.text,
        'price': double.tryParse(_priceCtrl.text) ?? 0,
        'stock': int.tryParse(_stockCtrl.text) ?? 0,
        'unit': _unitCtrl.text,
        'category': _categoryCtrl.text,
        'category_slug': _catSlugCtrl.text,
        'image': _imageCtrl.text,
      };

      if (widget.product == null) {
        await ProductApiService.createProduct(data);
      } else {
        await ProductApiService.updateProduct(widget.product!['id'], data);
      }

      if (mounted) {
        Navigator.pop(context);
        widget.onSaved();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi lưu sản phẩm: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.product == null ? 'Thêm Sản Phẩm Mới' : 'Sửa Sản Phẩm'),
      content: SizedBox(
        width: 600,
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: _nameCtrl,
                  decoration: const InputDecoration(labelText: 'Tên Sản Phẩm *'),
                  validator: (v) => v!.isEmpty ? 'Vui lòng nhập tên' : null,
                ),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _skuCtrl,
                        decoration: const InputDecoration(labelText: 'Mã SKU *'),
                        validator: (v) => v!.isEmpty ? 'Bắt buộc' : null,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _slugCtrl,
                        decoration: const InputDecoration(labelText: 'Slug (URL) *'),
                        validator: (v) => v!.isEmpty ? 'Bắt buộc' : null,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _priceCtrl,
                        decoration: const InputDecoration(labelText: 'Giá Bán *'),
                        keyboardType: TextInputType.number,
                        validator: (v) => v!.isEmpty ? 'Bắt buộc' : null,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _unitCtrl,
                        decoration: const InputDecoration(labelText: 'Đơn Vị Tính'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _stockCtrl,
                        decoration: const InputDecoration(labelText: 'Tồn Kho'),
                        keyboardType: TextInputType.number,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _categoryCtrl,
                        decoration: const InputDecoration(labelText: 'Danh Mục'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _catSlugCtrl,
                        decoration: const InputDecoration(labelText: 'Danh Mục Slug'),
                      ),
                    ),
                  ],
                ),
                TextFormField(
                  controller: _imageCtrl,
                  decoration: const InputDecoration(labelText: 'URL Ảnh (http...)'),
                ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isSaving ? null : () => Navigator.pop(context),
          child: const Text('Hủy'),
        ),
        ElevatedButton(
          onPressed: _isSaving ? null : _save,
          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryTeal, foregroundColor: Colors.white),
          child: _isSaving
              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : const Text('Lưu'),
        ),
      ],
    );
  }
}

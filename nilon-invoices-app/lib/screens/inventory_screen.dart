import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/inventory_item_model.dart';
import '../models/stock_in_receipt_model.dart';
import '../providers/inventory_provider.dart';
import '../theme/app_theme.dart';
import '../utils/currency_formatter.dart';
import '../widgets/glass_card.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'Tất cả';
  bool _showOnlyLowStock = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _showAddItemDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const _AddEditItemDialog(),
    );
  }

  void _showEditItemDialog(BuildContext context, InventoryItemModel item) {
    showDialog(
      context: context,
      builder: (ctx) => _AddEditItemDialog(itemToEdit: item),
    );
  }

  void _showStockInDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const _CreateStockInDialog(),
    );
  }

  void _confirmDeleteItem(BuildContext context, InventoryProvider provider, InventoryItemModel item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Xác nhận xóa mặt hàng', style: TextStyle(fontWeight: FontWeight.bold)),
        content: Text('Bạn có chắc chắn muốn xóa mặt hàng "${item.name}" (SKU: ${item.sku}) khỏi danh sách tồn kho không?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () async {
              Navigator.pop(ctx);
              await provider.deleteInventoryItem(item.id);
            },
            child: const Text('Xóa', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final inventoryProvider = context.watch<InventoryProvider>();
    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');

    // Filter items
    final categories = ['Tất cả', ...inventoryProvider.items.map((i) => i.category).toSet()];
    final filteredItems = inventoryProvider.items.where((item) {
      final matchesSearch = item.name.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          item.sku.toLowerCase().contains(_searchController.text.toLowerCase());
      final matchesCategory = _selectedCategory == 'Tất cả' || item.category == _selectedCategory;
      final matchesLowStock = !_showOnlyLowStock || item.isLowStock;
      return matchesSearch && matchesCategory && matchesLowStock;
    }).toList();

    return RefreshIndicator(
      onRefresh: () => inventoryProvider.loadAllData(),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header & Action buttons
            LayoutBuilder(
              builder: (context, constraints) {
                final isMobile = constraints.maxWidth < 650;
                final titleSection = Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Quản Lý Tồn Kho & Hàng Hóa',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Theo dõi mức tồn kho cuộn PE, bạt dứa, vật tư công trình và lịch sử nhập xuất.',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                    ),
                  ],
                );

                final actionButtons = Wrap(
                  spacing: 12,
                  runSpacing: 8,
                  children: [
                    OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        side: const BorderSide(color: AppTheme.primaryTeal, width: 1.5),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () => _showStockInDialog(context),
                      icon: const Icon(Icons.input_rounded, color: AppTheme.primaryTeal, size: 18),
                      label: const Text('Nhập Kho', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryTeal,
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () => _showAddItemDialog(context),
                      icon: const Icon(Icons.add_box_rounded, color: Colors.white, size: 18),
                      label: const Text('Thêm Sản Phẩm', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                );

                if (isMobile) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      titleSection,
                      const SizedBox(height: 16),
                      actionButtons,
                    ],
                  );
                }

                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: titleSection),
                    actionButtons,
                  ],
                );
              },
            ),
            const SizedBox(height: 20),

            // KPI Cards Grid
            LayoutBuilder(
              builder: (context, constraints) {
                final crossAxisCount = constraints.maxWidth < 600
                    ? 1
                    : constraints.maxWidth < 1100
                        ? 2
                        : 4;

                return GridView.count(
                  crossAxisCount: crossAxisCount,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: constraints.maxWidth < 600 ? 2.5 : 1.8,
                  children: [
                    _buildKpiCard(
                      title: 'Tổng số sản phẩm',
                      value: '${inventoryProvider.totalItemCount} loại',
                      icon: Icons.inventory_2_outlined,
                      color: AppTheme.primaryTeal,
                      subtitle: 'Đang theo dõi trong hệ thống',
                    ),
                    _buildKpiCard(
                      title: 'Cảnh báo sắp hết kho',
                      value: '${inventoryProvider.lowStockCount} sản phẩm',
                      icon: Icons.warning_amber_rounded,
                      color: inventoryProvider.lowStockCount > 0 ? Colors.redAccent : AppTheme.colorEmerald,
                      subtitle: inventoryProvider.lowStockCount > 0 ? 'Cần lên kế hoạch nhập hàng' : 'Mức tồn an toàn',
                    ),
                    _buildKpiCard(
                      title: 'Tổng giá trị tồn kho',
                      value: currencyFormat.format(inventoryProvider.totalInventoryValue),
                      icon: Icons.account_balance_wallet_outlined,
                      color: const Color(0xFF0284C7),
                      subtitle: 'Ước tính giá vốn nhập hàng',
                    ),
                    _buildKpiCard(
                      title: 'Phiếu nhập kho',
                      value: '${inventoryProvider.totalStockInReceipts} lượt',
                      icon: Icons.assignment_outlined,
                      color: Colors.purple,
                      subtitle: 'Đã thực hiện giao dịch',
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 24),

            // Tabs Navigation
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: TabBar(
                controller: _tabController,
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                indicatorColor: AppTheme.primaryTeal,
                indicatorWeight: 3,
                labelColor: AppTheme.primaryTeal,
                unselectedLabelColor: AppTheme.textMuted,
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                tabs: const [
                  Tab(text: 'Danh Sách Hàng Tồn'),
                  Tab(text: 'Lịch Sử Nhập Kho'),
                  Tab(text: 'Nhật Ký Biến Động'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Tab Views Content
            SizedBox(
              height: 550,
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildInventoryTab(context, inventoryProvider, filteredItems, categories),
                  _buildStockInTab(context, inventoryProvider, dateFormat, currencyFormat),
                  _buildTransactionsTab(context, inventoryProvider, dateFormat),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required String subtitle,
  }) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textMuted)),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                child: Icon(icon, color: color, size: 20),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(height: 4),
          Text(subtitle, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
        ],
      ),
    );
  }

  Widget _buildInventoryTab(
    BuildContext context,
    InventoryProvider provider,
    List<InventoryItemModel> items,
    List<String> categories,
  ) {
    return Column(
      children: [
        GlassCard(
          padding: const EdgeInsets.all(12),
          child: Wrap(
            spacing: 16,
            runSpacing: 12,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              SizedBox(
                width: 250,
                child: TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Tìm SKU hoặc tên sản phẩm...',
                    prefixIcon: const Icon(Icons.search_rounded, size: 20),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.borderLight)),
                  ),
                ),
              ),
              DropdownButton<String>(
                value: _selectedCategory,
                underline: const SizedBox(),
                items: categories
                    .map((cat) => DropdownMenuItem(
                          value: cat,
                          child: Text(cat, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        ))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),
              InkWell(
                onTap: () => setState(() => _showOnlyLowStock = !_showOnlyLowStock),
                borderRadius: BorderRadius.circular(8),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Checkbox(
                        value: _showOnlyLowStock,
                        activeColor: Colors.redAccent,
                        onChanged: (val) => setState(() => _showOnlyLowStock = val ?? false),
                      ),
                      const Text(
                        'Chỉ hiện cảnh báo sắp hết',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.redAccent),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: items.isEmpty
              ? _buildEmptyState('Không tìm thấy sản phẩm kho phù hợp')
              : ListView.builder(
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    final item = items[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: item.isLowStock ? Colors.redAccent.withValues(alpha: 0.5) : AppTheme.borderLight,
                          width: item.isLowStock ? 1.5 : 1,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: item.isLowStock ? Colors.red.withValues(alpha: 0.1) : AppTheme.primaryTeal.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(
                                item.isLowStock ? Icons.warning_rounded : Icons.inventory_2_rounded,
                                color: item.isLowStock ? Colors.red : AppTheme.primaryTeal,
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(color: AppTheme.bgCanvas, borderRadius: BorderRadius.circular(4)),
                                        child: Text(item.sku, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.textMuted)),
                                      ),
                                      const SizedBox(width: 8),
                                      Flexible(
                                        child: Text(
                                          item.category,
                                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: AppTheme.primaryTeal),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                                  if (item.specs != null && item.specs!.isNotEmpty)
                                    Text('Quy cách: ${item.specs}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                                  if (item.location != null && item.location!.isNotEmpty)
                                    Text('Vị trí: ${item.location}', style: const TextStyle(fontSize: 12, color: Colors.indigo)),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  'Tồn: ${item.currentStock.toStringAsFixed(0)} ${item.unit}',
                                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: item.isLowStock ? Colors.red : AppTheme.primaryTeal),
                                ),
                                Text('Cảnh báo min: ${item.minStockAlert.toStringAsFixed(0)}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                const SizedBox(height: 4),
                                Wrap(
                                  spacing: 4,
                                  runSpacing: 4,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit_rounded, size: 18, color: Colors.blueAccent),
                                      onPressed: () => _showEditItemDialog(context, item),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline_rounded, size: 18, color: Colors.redAccent),
                                      onPressed: () => _confirmDeleteItem(context, provider, item),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildStockInTab(
    BuildContext context,
    InventoryProvider provider,
    DateFormat dateFormat,
    NumberFormat currencyFormat,
  ) {
    final receipts = provider.receipts;
    if (receipts.isEmpty) {
      return _buildEmptyState('Chưa có phiếu nhập kho nào');
    }

    return ListView.builder(
      itemCount: receipts.length,
      itemBuilder: (context, index) {
        final rc = receipts[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.purple.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.note_add_rounded, color: Colors.purple, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              rc.receiptCode,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primaryTeal),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(color: Colors.purple.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                            child: Text('Lô: ${rc.batchCode}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.purple)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(rc.productName, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                      if (rc.supplier != null) Text('Nhà cung cấp: ${rc.supplier}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                      Text('Người tạo: ${rc.createdBy} • ${dateFormat.format(rc.createdAt)}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('+${rc.quantity.toStringAsFixed(0)} ${rc.unit}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.colorEmerald)),
                    Text(currencyFormat.format(rc.totalAmount), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppTheme.textDark)),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTransactionsTab(
    BuildContext context,
    InventoryProvider provider,
    DateFormat dateFormat,
  ) {
    final txs = provider.transactions;
    if (txs.isEmpty) {
      return _buildEmptyState('Chưa có lịch sử biến động kho');
    }

    return ListView.builder(
      itemCount: txs.length,
      itemBuilder: (context, index) {
        final tx = txs[index];
        final isAdd = tx.type == 'STOCK_IN' || tx.type == 'PRODUCTION_ADD';
        final typeLabel = tx.type == 'STOCK_IN'
            ? 'Nhập kho'
            : tx.type == 'PRODUCTION_ADD'
                ? 'Sản xuất cộng kho'
                : 'Xuất kho / Điều chỉnh';

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isAdd ? AppTheme.colorEmerald.withValues(alpha: 0.1) : Colors.orange.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(isAdd ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded, color: isAdd ? AppTheme.colorEmerald : Colors.orange, size: 20),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(color: (isAdd ? AppTheme.colorEmerald : Colors.orange).withValues(alpha: 0.15), borderRadius: BorderRadius.circular(4)),
                            child: Text(typeLabel, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isAdd ? AppTheme.colorEmerald : Colors.orange)),
                          ),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Text(
                              'Mã Ref: ${tx.referenceCode}',
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(tx.productName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                      if (tx.notes != null) Text(tx.notes!, style: const TextStyle(fontSize: 11.5, color: AppTheme.textMuted)),
                      Text('${tx.createdBy} • ${dateFormat.format(tx.createdAt)}', style: const TextStyle(fontSize: 10.5, color: AppTheme.textMuted)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${isAdd ? "+" : ""}${tx.quantityChange.toStringAsFixed(0)}',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: isAdd ? AppTheme.colorEmerald : Colors.red),
                    ),
                    Text('Tồn sau: ${tx.balanceAfter.toStringAsFixed(0)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmptyState(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.inbox_outlined, size: 48, color: AppTheme.textMuted),
          const SizedBox(height: 12),
          Text(message, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textMuted, fontSize: 14)),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// DIALOG: ADD / EDIT INVENTORY ITEM
// ─────────────────────────────────────────────
class _AddEditItemDialog extends StatefulWidget {
  final InventoryItemModel? itemToEdit;

  const _AddEditItemDialog({this.itemToEdit});

  @override
  State<_AddEditItemDialog> createState() => _AddEditItemDialogState();
}

class _AddEditItemDialogState extends State<_AddEditItemDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _skuCtrl;
  late TextEditingController _nameCtrl;
  late TextEditingController _categoryCtrl;
  late TextEditingController _unitCtrl;
  late TextEditingController _currentStockCtrl;
  late TextEditingController _minStockCtrl;
  late TextEditingController _importPriceCtrl;
  late TextEditingController _sellingPriceCtrl;
  late TextEditingController _specsCtrl;
  late TextEditingController _locationCtrl;

  @override
  void initState() {
    super.initState();
    final item = widget.itemToEdit;
    _skuCtrl = TextEditingController(text: item?.sku ?? 'PE-LOT-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}');
    _nameCtrl = TextEditingController(text: item?.name ?? '');
    _categoryCtrl = TextEditingController(text: item?.category ?? 'Nilon Lót Sàn PE');
    _unitCtrl = TextEditingController(text: item?.unit ?? 'Cuộn');
    _currentStockCtrl = TextEditingController(text: item?.currentStock.toStringAsFixed(0) ?? '50');
    _minStockCtrl = TextEditingController(text: item?.minStockAlert.toStringAsFixed(0) ?? '15');
    _importPriceCtrl = TextEditingController(text: item?.importPrice.toStringAsFixed(0) ?? '350000');
    _sellingPriceCtrl = TextEditingController(text: item?.sellingPrice.toStringAsFixed(0) ?? '480000');
    _specsCtrl = TextEditingController(text: item?.specs ?? 'Khổ 2m x 200m');
    _locationCtrl = TextEditingController(text: item?.location ?? 'Kho A');
  }

  @override
  void dispose() {
    _skuCtrl.dispose();
    _nameCtrl.dispose();
    _categoryCtrl.dispose();
    _unitCtrl.dispose();
    _currentStockCtrl.dispose();
    _minStockCtrl.dispose();
    _importPriceCtrl.dispose();
    _sellingPriceCtrl.dispose();
    _specsCtrl.dispose();
    _locationCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.itemToEdit != null;

    return AlertDialog(
      title: Text(isEditing ? 'Chỉnh Sửa Sản Phẩm Kho' : 'Thêm Sản Phẩm Kho Mới', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
      content: SizedBox(
        width: 500,
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Expanded(child: _buildInput('Mã SKU', _skuCtrl, required: true)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildInput('Danh mục', _categoryCtrl, required: true)),
                  ],
                ),
                const SizedBox(height: 12),
                _buildInput('Tên sản phẩm', _nameCtrl, required: true),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildInput('Số lượng tồn hiện tại', _currentStockCtrl, isNumber: true)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildInput('Mức cảnh báo tồn min', _minStockCtrl, isNumber: true)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildInput('Đơn vị tính', _unitCtrl)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildInput('Giá nhập vốn (₫)', _importPriceCtrl, isCurrency: true)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildInput('Giá bán đề xuất (₫)', _sellingPriceCtrl, isCurrency: true)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildInput('Quy cách (Khổ/Độ dày)', _specsCtrl)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildInput('Vị trí lưu kho', _locationCtrl)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy', style: TextStyle(color: AppTheme.textMuted))),
        ElevatedButton(
          onPressed: () async {
            if (_formKey.currentState?.validate() ?? false) {
              final provider = context.read<InventoryProvider>();
              final newItem = InventoryItemModel(
                id: isEditing ? widget.itemToEdit!.id : 'PROD-${DateTime.now().millisecondsSinceEpoch.toString().substring(6)}',
                sku: _skuCtrl.text.trim(),
                name: _nameCtrl.text.trim(),
                category: _categoryCtrl.text.trim(),
                unit: _unitCtrl.text.trim(),
                currentStock: double.tryParse(_currentStockCtrl.text) ?? 0,
                minStockAlert: double.tryParse(_minStockCtrl.text) ?? 10,
                importPrice: double.tryParse(_importPriceCtrl.text.replaceAll('.', '')) ?? 0,
                sellingPrice: double.tryParse(_sellingPriceCtrl.text.replaceAll('.', '')) ?? 0,
                specs: _specsCtrl.text.trim(),
                location: _locationCtrl.text.trim(),
                createdAt: isEditing ? widget.itemToEdit!.createdAt : DateTime.now(),
                lastUpdated: DateTime.now(),
              );

              final navigator = Navigator.of(context);
              if (isEditing) {
                await provider.updateInventoryItem(newItem);
              } else {
                await provider.addInventoryItem(newItem);
              }

              if (mounted) navigator.pop();
            }
          },
          child: Text(isEditing ? 'Lưu Thay Đổi' : 'Thêm Vào Kho', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      ],
    );
  }

  Widget _buildInput(String label, TextEditingController controller, {bool required = false, bool isNumber = false, bool isCurrency = false}) {
    return TextFormField(
      controller: controller,
      keyboardType: isNumber || isCurrency ? TextInputType.number : TextInputType.text,
      inputFormatters: isCurrency ? [CurrencyInputFormatter()] : [],
      validator: (val) => required && (val == null || val.isEmpty) ? 'Không được bỏ trống' : null,
      decoration: InputDecoration(
        labelText: label,
        isDense: true,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// DIALOG: CREATE STOCK IN RECEIPT
// ─────────────────────────────────────────────
class _CreateStockInDialog extends StatefulWidget {
  const _CreateStockInDialog();

  @override
  State<_CreateStockInDialog> createState() => _CreateStockInDialogState();
}

class _CreateStockInDialogState extends State<_CreateStockInDialog> {
  final _formKey = GlobalKey<FormState>();
  String? _selectedProductId;
  late TextEditingController _receiptCodeCtrl;
  late TextEditingController _quantityCtrl;
  late TextEditingController _importPriceCtrl;
  late TextEditingController _batchCodeCtrl;
  late TextEditingController _supplierCtrl;
  late TextEditingController _createdByCtrl;
  late TextEditingController _notesCtrl;

  @override
  void initState() {
    super.initState();
    final rnd = DateTime.now().millisecondsSinceEpoch.toString().substring(7);
    _receiptCodeCtrl = TextEditingController(text: 'NK-202608-$rnd');
    _quantityCtrl = TextEditingController(text: '20');
    _importPriceCtrl = TextEditingController(text: '350000');
    _batchCodeCtrl = TextEditingController(text: 'LOT-2026-$rnd');
    _supplierCtrl = TextEditingController(text: 'Công ty Nhựa Phú Mỹ');
    _createdByCtrl = TextEditingController(text: 'Quản Kho Tuấn');
    _notesCtrl = TextEditingController(text: 'Nhập bổ sung cho kho hàng');
  }

  @override
  void dispose() {
    _receiptCodeCtrl.dispose();
    _quantityCtrl.dispose();
    _importPriceCtrl.dispose();
    _batchCodeCtrl.dispose();
    _supplierCtrl.dispose();
    _createdByCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final inventoryProvider = context.watch<InventoryProvider>();
    final items = inventoryProvider.items;

    if (items.isEmpty) {
      return AlertDialog(
        title: const Text('Lập Phiếu Nhập Kho Mới', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
        content: const Text('Chưa có sản phẩm nào trong kho. Vui lòng tạo sản phẩm trước khi lập phiếu nhập kho.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Đóng', style: TextStyle(fontWeight: FontWeight.bold))),
        ],
      );
    }

    if (_selectedProductId == null && items.isNotEmpty) {
      _selectedProductId = items.first.id;
      _importPriceCtrl.text = items.first.importPrice.toStringAsFixed(0);
    }

    final selectedProduct = items.firstWhere((i) => i.id == _selectedProductId, orElse: () => items.first);

    return AlertDialog(
      title: const Text('Lập Phiếu Nhập Kho Mới', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
      content: SizedBox(
        width: 500,
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _receiptCodeCtrl,
                        decoration: InputDecoration(labelText: 'Mã phiếu nhập', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _batchCodeCtrl,
                        decoration: InputDecoration(labelText: 'Mã số lô hàng', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  isExpanded: true,
                  initialValue: _selectedProductId,
                  decoration: InputDecoration(labelText: 'Chọn sản phẩm nhập kho', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                  items: items
                      .map((i) => DropdownMenuItem(
                            value: i.id,
                            child: Text('${i.name} (SKU: ${i.sku})', overflow: TextOverflow.ellipsis),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        _selectedProductId = val;
                        final prod = items.firstWhere((item) => item.id == val);
                        _importPriceCtrl.text = prod.importPrice.toStringAsFixed(0);
                      });
                    }
                  },
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _quantityCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(labelText: 'Số lượng nhập (${selectedProduct.unit})', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _importPriceCtrl,
                        keyboardType: TextInputType.number,
                        inputFormatters: [CurrencyInputFormatter()],
                        decoration: InputDecoration(labelText: 'Giá nhập đơn vị (₫)', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _supplierCtrl,
                        decoration: InputDecoration(labelText: 'Nhà cung cấp', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _createdByCtrl,
                        decoration: InputDecoration(labelText: 'Người thực hiện nhập', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _notesCtrl,
                  decoration: InputDecoration(labelText: 'Ghi chú phiếu nhập', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy', style: TextStyle(color: AppTheme.textMuted))),
        ElevatedButton(
          onPressed: () async {
            if (_formKey.currentState?.validate() ?? false) {
              final qty = double.tryParse(_quantityCtrl.text) ?? 0;
              final price = double.tryParse(_importPriceCtrl.text.replaceAll('.', '')) ?? 0;

              final receipt = StockInReceiptModel(
                id: 'RC-${DateTime.now().millisecondsSinceEpoch}',
                receiptCode: _receiptCodeCtrl.text.trim(),
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                quantity: qty,
                unit: selectedProduct.unit,
                importPrice: price,
                totalAmount: qty * price,
                batchCode: _batchCodeCtrl.text.trim(),
                supplier: _supplierCtrl.text.trim(),
                notes: _notesCtrl.text.trim(),
                createdAt: DateTime.now(),
                createdBy: _createdByCtrl.text.trim(),
              );

              final navigator = Navigator.of(context);
              await inventoryProvider.createStockInReceipt(receipt);
              if (mounted) navigator.pop();
            }
          },
          child: const Text('Tạo Phiếu & Cộng Kho', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      ],
    );
  }
}

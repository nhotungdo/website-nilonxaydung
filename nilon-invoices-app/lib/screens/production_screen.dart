import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/production_log_model.dart';
import '../providers/production_provider.dart';
import '../providers/inventory_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class ProductionScreen extends StatefulWidget {
  const ProductionScreen({super.key});

  @override
  State<ProductionScreen> createState() => _ProductionScreenState();
}

class _ProductionScreenState extends State<ProductionScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedShiftFilter = 'Tất cả';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showAddLogDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const _AddProductionLogDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final productionProvider = context.watch<ProductionProvider>();
    final dateFormat = DateFormat('dd/MM/yyyy');

    final shifts = ['Tất cả', 'Ca 1 (Sáng 06:00 - 14:00)', 'Ca 2 (Chiều 14:00 - 22:00)', 'Ca 3 (Đêm 22:00 - 06:00)'];

    // Filter logs
    final filteredLogs = productionProvider.logs.where((log) {
      final matchesSearch = log.machineId.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          log.operatorName.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          log.productName.toLowerCase().contains(_searchController.text.toLowerCase());
      final matchesShift = _selectedShiftFilter == 'Tất cả' || log.shift == _selectedShiftFilter;
      return matchesSearch && matchesShift;
    }).toList();

    return RefreshIndicator(
      onRefresh: () => productionProvider.fetchLogs(),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Section
            LayoutBuilder(
              builder: (context, constraints) {
                final isMobile = constraints.maxWidth < 650;
                final titleSection = Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'Nhật Ký & Quản Lý Sản Xuất',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Theo dõi ca thổi nilon, cắt cuộn, sản lượng máy và tỷ lệ hao hụt phế phẩm.',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                    ),
                  ],
                );

                final actionButton = ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryTeal,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => _showAddLogDialog(context),
                  icon: const Icon(Icons.precision_manufacturing_rounded, color: Colors.white, size: 20),
                  label: const Text('Ghi Nhận Ca Sản Xuất', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                );

                if (isMobile) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      titleSection,
                      const SizedBox(height: 16),
                      actionButton,
                    ],
                  );
                }

                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: titleSection),
                    actionButton,
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
                      title: 'Sản lượng hôm nay',
                      value: '${productionProvider.totalProducedToday.toStringAsFixed(0)} Cuộn',
                      icon: Icons.factory_rounded,
                      color: AppTheme.primaryTeal,
                      subtitle: 'Tổng hoàn thành các máy',
                    ),
                    _buildKpiCard(
                      title: 'Phế phẩm / Hao hụt',
                      value: '${productionProvider.totalWasteToday.toStringAsFixed(1)} Kg',
                      icon: Icons.delete_sweep_rounded,
                      color: Colors.orange,
                      subtitle: 'Lượng nilon phế phẩm phát sinh',
                    ),
                    _buildKpiCard(
                      title: 'Ca máy vận hành',
                      value: '${productionProvider.activeShiftsCountToday} ca',
                      icon: Icons.av_timer_rounded,
                      color: const Color(0xFF0284C7),
                      subtitle: 'Số ca làm việc trong ngày',
                    ),
                    _buildKpiCard(
                      title: 'Tỷ lệ hao hụt',
                      value: '${productionProvider.wastePercentageToday.toStringAsFixed(1)}%',
                      icon: Icons.pie_chart_outline_rounded,
                      color: productionProvider.wastePercentageToday > 5 ? Colors.redAccent : AppTheme.colorEmerald,
                      subtitle: productionProvider.wastePercentageToday > 5 ? 'Vượt định mức cho phép (3-5%)' : 'Nằm trong ngưỡng định mức',
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 24),

            // Search & Filter Card
            GlassCard(
              padding: const EdgeInsets.all(16),
              child: Wrap(
                spacing: 16,
                runSpacing: 12,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  SizedBox(
                    width: 280,
                    child: TextField(
                      controller: _searchController,
                      onChanged: (_) => setState(() {}),
                      decoration: InputDecoration(
                        hintText: 'Tìm theo máy, công nhân, sản phẩm...',
                        prefixIcon: const Icon(Icons.search_rounded, size: 20),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.borderLight)),
                      ),
                    ),
                  ),
                  DropdownButton<String>(
                    value: _selectedShiftFilter,
                    underline: const SizedBox(),
                    items: shifts
                        .map((shift) => DropdownMenuItem(
                              value: shift,
                              child: Text(shift, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                            ))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedShiftFilter = val);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Logs List Section
            SizedBox(
              height: 550,
              child: filteredLogs.isEmpty
                  ? _buildEmptyState('Chưa có nhật ký sản xuất nào phù hợp')
                  : ListView.builder(
                      itemCount: filteredLogs.length,
                      itemBuilder: (context, index) {
                        final log = filteredLogs[index];

                        return Card(
                          margin: const EdgeInsets.only(bottom: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                            side: const BorderSide(color: AppTheme.borderLight),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(18),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Left Icon Badge
                                Container(
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryTeal.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(Icons.settings_suggest_rounded, color: AppTheme.primaryTeal, size: 28),
                                ),
                                const SizedBox(width: 16),

                                // Main Content
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: AppTheme.primaryTeal,
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              log.shift,
                                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Text(
                                            log.machineId,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark),
                                          ),
                                          const SizedBox(width: 8),
                                          Text(
                                            '(${dateFormat.format(log.productionDate)})',
                                            style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        'Sản phẩm: ${log.productName}',
                                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppTheme.primaryDarkTeal),
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          const Icon(Icons.person_outline_rounded, size: 16, color: AppTheme.textMuted),
                                          const SizedBox(width: 4),
                                          Text(
                                            'Người vận hành: ${log.operatorName}',
                                            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                                          ),
                                          if (log.autoAddedToStock) ...[
                                            const SizedBox(width: 12),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: AppTheme.colorEmerald.withValues(alpha: 0.15),
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                              child: const Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Icon(Icons.check_circle_rounded, size: 12, color: AppTheme.colorEmerald),
                                                  SizedBox(width: 4),
                                                  Text(
                                                    'Đã tự động cộng tồn kho',
                                                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.colorEmerald),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                      if (log.notes != null && log.notes!.isNotEmpty) ...[
                                        const SizedBox(height: 6),
                                        Text(
                                          'Ghi chú: ${log.notes}',
                                          style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: AppTheme.textMuted),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),

                                // Output & Waste metrics
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      '+${log.producedQuantity.toStringAsFixed(0)} ${log.unit}',
                                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppTheme.colorEmerald),
                                    ),
                                    const SizedBox(height: 4),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: Colors.orange.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        'Hao hụt: ${log.wasteQuantity.toStringAsFixed(1)} Kg',
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.orange),
                                      ),
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

  Widget _buildEmptyState(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.precision_manufacturing_outlined, size: 48, color: AppTheme.textMuted),
          const SizedBox(height: 12),
          Text(message, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textMuted, fontSize: 14)),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// DIALOG: ADD PRODUCTION LOG
// ─────────────────────────────────────────────
class _AddProductionLogDialog extends StatefulWidget {
  const _AddProductionLogDialog();

  @override
  State<_AddProductionLogDialog> createState() => _AddProductionLogDialogState();
}

class _AddProductionLogDialogState extends State<_AddProductionLogDialog> {
  final _formKey = GlobalKey<FormState>();
  String _selectedShift = 'Ca 1 (Sáng 06:00 - 14:00)';
  String? _selectedProductId;
  late TextEditingController _machineCtrl;
  late TextEditingController _operatorCtrl;
  late TextEditingController _producedQtyCtrl;
  late TextEditingController _wasteQtyCtrl;
  late TextEditingController _notesCtrl;
  bool _autoAddedToStock = true;

  @override
  void initState() {
    super.initState();
    _machineCtrl = TextEditingController(text: 'Máy Thổi PE 01 (Khổ 2m)');
    _operatorCtrl = TextEditingController(text: 'Nguyễn Văn Nam');
    _producedQtyCtrl = TextEditingController(text: '30');
    _wasteQtyCtrl = TextEditingController(text: '1.2');
    _notesCtrl = TextEditingController(text: 'Ca làm việc đạt sản lượng mục tiêu');
  }

  @override
  void dispose() {
    _machineCtrl.dispose();
    _operatorCtrl.dispose();
    _producedQtyCtrl.dispose();
    _wasteQtyCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final inventoryProvider = context.watch<InventoryProvider>();
    final inventoryItems = inventoryProvider.items;

    if (inventoryItems.isEmpty) {
      return AlertDialog(
        title: const Text('Ghi Nhận Ca Sản Xuất Mới', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
        content: const Text('Chưa có sản phẩm nào trong kho. Vui lòng sang tab "Trong kho" để tạo sản phẩm trước khi ghi nhận sản xuất.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Đóng', style: TextStyle(fontWeight: FontWeight.bold))),
        ],
      );
    }

    if (_selectedProductId == null && inventoryItems.isNotEmpty) {
      _selectedProductId = inventoryItems.first.id;
    }

    final selectedProduct = inventoryItems.firstWhere(
      (i) => i.id == _selectedProductId,
      orElse: () => inventoryItems.first,
    );

    return AlertDialog(
      title: const Text('Ghi Nhận Ca Sản Xuất Mới', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
      content: SizedBox(
        width: 500,
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<String>(
                  initialValue: _selectedShift,
                  decoration: InputDecoration(labelText: 'Chọn Ca Sản Xuất', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                  items: const [
                    DropdownMenuItem(value: 'Ca 1 (Sáng 06:00 - 14:00)', child: Text('Ca 1 (Sáng 06:00 - 14:00)')),
                    DropdownMenuItem(value: 'Ca 2 (Chiều 14:00 - 22:00)', child: Text('Ca 2 (Chiều 14:00 - 22:00)')),
                    DropdownMenuItem(value: 'Ca 3 (Đêm 22:00 - 06:00)', child: Text('Ca 3 (Đêm 22:00 - 06:00)')),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedShift = val);
                  },
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _machineCtrl,
                        decoration: InputDecoration(labelText: 'Máy sản xuất', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                        validator: (val) => val == null || val.isEmpty ? 'Không bỏ trống' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _operatorCtrl,
                        decoration: InputDecoration(labelText: 'Người vận hành', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                        validator: (val) => val == null || val.isEmpty ? 'Không bỏ trống' : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _selectedProductId,
                  decoration: InputDecoration(labelText: 'Sản phẩm đầu ra', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
                  items: inventoryItems
                      .map((i) => DropdownMenuItem(
                            value: i.id,
                            child: Text('${i.name} (${i.sku})', overflow: TextOverflow.ellipsis),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedProductId = val);
                  },
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _producedQtyCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Sản lượng đạt được (${selectedProduct.unit})',
                          isDense: true,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        validator: (val) => val == null || val.isEmpty ? 'Không bỏ trống' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _wasteQtyCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Phế phẩm / Hao hụt (Kg)',
                          isDense: true,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                CheckboxListTile(
                  title: const Text('Tự động cộng sản lượng vào số lượng hàng tồn kho', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  value: _autoAddedToStock,
                  activeColor: AppTheme.primaryTeal,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (val) => setState(() => _autoAddedToStock = val ?? true),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _notesCtrl,
                  decoration: InputDecoration(labelText: 'Ghi chú ca sản xuất', isDense: true, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
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
              final prodQty = double.tryParse(_producedQtyCtrl.text) ?? 0;
              final wasteQty = double.tryParse(_wasteQtyCtrl.text) ?? 0;

              final log = DailyProductionLogModel(
                id: 'LOG-SX-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
                productionDate: DateTime.now(),
                shift: _selectedShift,
                machineId: _machineCtrl.text.trim(),
                operatorName: _operatorCtrl.text.trim(),
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                producedQuantity: prodQty,
                wasteQuantity: wasteQty,
                unit: selectedProduct.unit,
                autoAddedToStock: _autoAddedToStock,
                notes: _notesCtrl.text.trim(),
                createdAt: DateTime.now(),
              );

              final navigator = Navigator.of(context);
              final inventoryProvider = context.read<InventoryProvider>();
              final productionProvider = context.read<ProductionProvider>();
              await productionProvider.addProductionLog(
                log: log,
                targetProduct: _autoAddedToStock ? selectedProduct : null,
              );

              // Also reload inventory provider if auto added to stock
              if (_autoAddedToStock) {
                inventoryProvider.loadAllData();
              }

              if (mounted) navigator.pop();
            }
          },
          child: const Text('Ghi Nhận Ca', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      ],
    );
  }
}

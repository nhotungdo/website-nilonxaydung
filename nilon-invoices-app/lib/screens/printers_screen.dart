import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/printer_model.dart';
import '../providers/printer_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import '../widgets/confirm_dialog.dart';

class PrintersScreen extends StatelessWidget {
  const PrintersScreen({super.key});

  void _showAddPrinterModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const _AddPrinterDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final printerProvider = context.watch<PrinterProvider>();
    final printers = printerProvider.printers;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LayoutBuilder(
            builder: (context, constraints) {
              final isMobile = constraints.maxWidth < 650;

              final titleSection = Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          'Cài đặt máy in',
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                        ),
                      ),
                      SizedBox(width: 8),
                      Chip(
                        label: Text('CHỈ QUẢN TRỊ', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                        backgroundColor: AppTheme.primaryTeal,
                        padding: EdgeInsets.zero,
                        visualDensity: VisualDensity.compact,
                      ),
                    ],
                  ),
                  Text(
                    'Cấu hình danh sách máy in hóa đơn nhiệt LAN/USB/WIFI và máy in mặc định.',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                  ),
                ],
              );

              final actionSection = ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryTeal,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () => _showAddPrinterModal(context),
                icon: const Icon(Icons.add_rounded, color: Colors.white),
                label: const Text('Thêm máy in mới', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              );

              if (isMobile) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    titleSection,
                    const SizedBox(height: 12),
                    actionSection,
                  ],
                );
              }

              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(child: titleSection),
                  const SizedBox(width: 12),
                  actionSection,
                ],
              );
            },
          ),
          const SizedBox(height: 24),

          GlassCard(
            padding: const EdgeInsets.all(0),
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minWidth: constraints.maxWidth),
                    child: DataTable(
                  headingRowColor: WidgetStateProperty.all(const Color(0xFFF8FAFC)),
                  columns: const [
                    DataColumn(label: Text('TÊN MÁY IN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('KHỔ GIẤY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('KẾT NỐI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('ĐỊA CHỈ MÁY IN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('TRẠNG THÁI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('MẶC ĐỊNH', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('THAO TÁC', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                  ],
                  rows: printers.map((printer) {
                    final isOnline = printer.status == 'ONLINE';
                    final statusBg = isOnline ? Colors.green.shade50 : Colors.red.shade50;
                    final statusTextClr = isOnline ? Colors.green.shade800 : Colors.red.shade800;

                    return DataRow(
                      cells: [
                        DataCell(
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryTeal.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Icon(Icons.print_rounded, size: 18, color: AppTheme.primaryTeal),
                              ),
                              const SizedBox(width: 10),
                              Text(printer.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        DataCell(
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(printer.paperSize, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        DataCell(Text(printer.connectionType, style: const TextStyle(fontWeight: FontWeight.w600))),
                        DataCell(
                          Text(
                            printer.connectionType == 'USB' ? 'Cổng USB cục bộ' : '${printer.ipAddress}:${printer.port}',
                            style: const TextStyle(fontSize: 12, fontFamily: 'monospace'),
                          ),
                        ),
                        DataCell(
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusBg,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              isOnline ? 'TRỰC TUYẾN' : 'MẤT KẾT NỐI',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: statusTextClr,
                              ),
                            ),
                          ),
                        ),
                        DataCell(
                          printer.isDefault
                              ? Row(
                                  children: const [
                                    Icon(Icons.check_circle_rounded, color: Colors.green, size: 16),
                                    SizedBox(width: 4),
                                    Text('Mặc định', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 12)),
                                  ],
                                )
                              : TextButton(
                                  onPressed: () {
                                    printerProvider.setDefaultPrinter(printer.id);
                                  },
                                  child: const Text('Đặt mặc định', style: TextStyle(fontSize: 12)),
                                ),
                        ),
                        DataCell(
                          Row(
                            children: [
                              OutlinedButton.icon(
                                style: OutlinedButton.styleFrom(visualDensity: VisualDensity.compact),
                                onPressed: () async {
                                  final res = await printerProvider.testPrinter(printer.id);
                                  if (res && context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(content: Text('Đã gửi trang in kiểm tra tới ${printer.name}')),
                                    );
                                  }
                                },
                                icon: const Icon(Icons.print_rounded, size: 14),
                                label: const Text('In thử', style: TextStyle(fontSize: 11)),
                              ),
                              const SizedBox(width: 4),
                              IconButton(
                                icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 18),
                                onPressed: () {
                                  showDialog(
                                    context: context,
                                    builder: (ctx) => ConfirmDialog(
                                      title: 'Xóa cấu hình máy in',
                                      message: 'Bạn có chắc chắn muốn xóa máy in ${printer.name} không?',
                                      onConfirm: () {
                                        printerProvider.deletePrinter(printer.id);
                                      },
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ),
            );
          },
        ),
          ),
        ],
      ),
    );
  }
}

class _AddPrinterDialog extends StatefulWidget {
  const _AddPrinterDialog();

  @override
  State<_AddPrinterDialog> createState() => _AddPrinterDialogState();
}

class _AddPrinterDialogState extends State<_AddPrinterDialog> {
  final _nameCtrl = TextEditingController();
  final _ipCtrl = TextEditingController(text: '192.168.1.100');
  final _portCtrl = TextEditingController(text: '9100');
  String _paperSize = 'K80';
  String _connectionType = 'LAN';

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: Row(
        children: const [
          Icon(Icons.print_rounded, color: AppTheme.primaryTeal),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              'Thêm máy in hóa đơn mới',
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
        ],
      ),
      content: SizedBox(
        width: 400,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameCtrl,
              decoration: const InputDecoration(labelText: 'Tên máy in *', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    initialValue: _paperSize,
                    decoration: const InputDecoration(labelText: 'Khổ giấy', border: OutlineInputBorder()),
                    items: const [
                      DropdownMenuItem(value: 'K80', child: Text('K80 (80mm)')),
                      DropdownMenuItem(value: 'K58', child: Text('K58 (58mm)')),
                    ],
                    onChanged: (val) => setState(() => _paperSize = val ?? 'K80'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    initialValue: _connectionType,
                    decoration: const InputDecoration(labelText: 'Kết nối', border: OutlineInputBorder()),
                    items: const [
                      DropdownMenuItem(value: 'LAN', child: Text('LAN (Ethernet)')),
                      DropdownMenuItem(value: 'USB', child: Text('USB Local')),
                      DropdownMenuItem(value: 'WIFI', child: Text('WIFI')),
                    ],
                    onChanged: (val) => setState(() => _connectionType = val ?? 'LAN'),
                  ),
                ),
              ],
            ),
            if (_connectionType != 'USB') ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: TextField(
                      controller: _ipCtrl,
                      decoration: const InputDecoration(labelText: 'Địa chỉ IP', border: OutlineInputBorder()),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 1,
                    child: TextField(
                      controller: _portCtrl,
                      decoration: const InputDecoration(labelText: 'Port', border: OutlineInputBorder()),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Hủy bỏ', style: TextStyle(color: Colors.grey)),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryTeal),
          onPressed: () {
            if (_nameCtrl.text.isEmpty) return;
            context.read<PrinterProvider>().addPrinter(
                  PrinterModel(
                    id: 'p-${DateTime.now().millisecondsSinceEpoch}',
                    name: _nameCtrl.text,
                    paperSize: _paperSize,
                    connectionType: _connectionType,
                    ipAddress: _connectionType == 'USB' ? null : _ipCtrl.text,
                    port: _connectionType == 'USB' ? null : int.tryParse(_portCtrl.text) ?? 9100,
                    status: 'ONLINE',
                    isDefault: false,
                  ),
                );
            Navigator.of(context).pop();
          },
          child: const Text('Lưu máy in', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}

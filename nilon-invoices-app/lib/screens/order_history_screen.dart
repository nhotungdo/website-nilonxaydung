import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/order_provider.dart';
import '../providers/queue_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class OrderHistoryScreen extends StatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  State<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> {
  String _searchQuery = '';
  String _dateRange = 'Tháng này';

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final queueProvider = context.read<QueueProvider>();
    final orders = orderProvider.orders;

    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    final filteredOrders = orders.where((o) {
      final matchesSearch = _searchQuery.isEmpty ||
          o.orderCode.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          o.customerPhone.contains(_searchQuery);

      return matchesSearch;
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Lịch sử đơn hàng & Tra cứu',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                  ),
                  Text(
                    'Tra cứu chi tiết danh sách tất cả các hóa đơn đã xuất trong quá khứ.',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                  ),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryTeal,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Đã xuất báo cáo lịch sử đơn hàng ra file Excel (nilon_invoices_report.xlsx)')),
                  );
                },
                icon: const Icon(Icons.file_download_outlined, color: Colors.white),
                label: const Text('Xuất báo cáo Excel', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Search & Filter Row
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Nhập mã đơn hàng, tên khách hàng hoặc SĐT...',
                      prefixIcon: const Icon(Icons.search_rounded, color: Colors.grey),
                      filled: true,
                      fillColor: Colors.grey.shade100,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    onChanged: (val) {
                      setState(() {
                        _searchQuery = val;
                      });
                    },
                  ),
                ),
                const SizedBox(width: 16),
                DropdownButton<String>(
                  value: _dateRange,
                  underline: const SizedBox(),
                  items: const [
                    DropdownMenuItem(value: 'Hôm nay', child: Text('Hôm nay')),
                    DropdownMenuItem(value: '7 ngày qua', child: Text('7 ngày qua')),
                    DropdownMenuItem(value: 'Tháng này', child: Text('Tháng này')),
                  ],
                  onChanged: (val) {
                    setState(() {
                      _dateRange = val ?? 'Tháng này';
                    });
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Table
          GlassCard(
            padding: const EdgeInsets.all(0),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: ConstrainedBox(
                constraints: BoxConstraints(minWidth: MediaQuery.of(context).size.width - 320),
                child: DataTable(
                  headingRowColor: WidgetStateProperty.all(const Color(0xFFF8FAFC)),
                  columns: const [
                    DataColumn(label: Text('MÃ ĐƠN HÀNG', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('KHÁCH HÀNG', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('SỐ ĐIỆN THOẠI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('TỔNG TIỀN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('THANH TOÁN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('THỜI GIAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                    DataColumn(label: Text('THAO TÁC', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                  ],
                  rows: filteredOrders.map((order) {
                    return DataRow(
                      cells: [
                        DataCell(
                          Text(
                            order.orderCode,
                            style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryTeal),
                          ),
                        ),
                        DataCell(Text(order.customerName, style: const TextStyle(fontWeight: FontWeight.w600))),
                        DataCell(Text(order.customerPhone)),
                        DataCell(Text(currencyFormat.format(order.totalAmount), style: const TextStyle(fontWeight: FontWeight.bold))),
                        DataCell(Text(order.paymentMethod, style: const TextStyle(fontSize: 12))),
                        DataCell(Text(DateFormat('dd/MM/yyyy HH:mm').format(order.createdAt), style: const TextStyle(fontSize: 11, color: Colors.grey))),
                        DataCell(
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(visualDensity: VisualDensity.compact),
                            onPressed: () {
                              queueProvider.addJob(order.id, order.orderCode, order.customerName, null);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Đã gửi lại lệnh in cho phiếu ${order.orderCode}')),
                              );
                            },
                            icon: const Icon(Icons.print_rounded, size: 14),
                            label: const Text('In lại', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

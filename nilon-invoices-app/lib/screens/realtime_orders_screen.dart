import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/order_provider.dart';
import '../providers/queue_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';
import '../widgets/confirm_dialog.dart';

class RealtimeOrdersScreen extends StatefulWidget {
  final Function(String route) onNavigate;

  const RealtimeOrdersScreen({super.key, required this.onNavigate});

  @override
  State<RealtimeOrdersScreen> createState() => _RealtimeOrdersScreenState();
}

class _RealtimeOrdersScreenState extends State<RealtimeOrdersScreen> {
  String _activeTab = 'waiting';

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final queueProvider = context.read<QueueProvider>();
    final orders = orderProvider.orders;

    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    final waitingList = orders.where((o) => o.printStatus == 'waiting' && o.orderStatus != 'cancelled').toList();
    final printedList = orders.where((o) => o.printStatus == 'printed' && o.orderStatus != 'cancelled').toList();
    final cancelledList = orders.where((o) => o.orderStatus == 'cancelled').toList();

    List displayedOrders;
    if (_activeTab == 'waiting') {
      displayedOrders = waitingList;
    } else if (_activeTab == 'printed') {
      displayedOrders = printedList;
    } else {
      displayedOrders = cancelledList;
    }

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
                    'Đơn hàng thời gian thực (Realtime)',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                  ),
                  Text(
                    'Theo dõi biến động đơn hàng tự động và điều khiển lệnh in tức thì.',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.green.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.wifi_tethering_rounded, color: Colors.green.shade700, size: 16),
                    const SizedBox(width: 6),
                    Text('Polling 3s active', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.green.shade700)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Tabs
          Row(
            children: [
              _buildTabButton('waiting', 'Đơn chờ in (${waitingList.length})', Icons.hourglass_top_rounded, Colors.amber.shade800),
              const SizedBox(width: 12),
              _buildTabButton('printed', 'Đã in hóa đơn (${printedList.length})', Icons.check_circle_rounded, Colors.green.shade700),
              const SizedBox(width: 12),
              _buildTabButton('cancelled', 'Đơn đã hủy (${cancelledList.length})', Icons.cancel_rounded, Colors.redAccent),
            ],
          ),
          const SizedBox(height: 20),

          // Order cards list
          if (displayedOrders.isEmpty)
            GlassCard(
              padding: const EdgeInsets.symmetric(vertical: 60),
              child: Center(
                child: Column(
                  children: const [
                    Icon(Icons.inbox_rounded, size: 48, color: Colors.grey),
                    SizedBox(height: 12),
                    Text('Không có đơn hàng nào trong mục này', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                  ],
                ),
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: displayedOrders.length,
              itemBuilder: (context, index) {
                final order = displayedOrders[index];

                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: GlassCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Card Header
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryTeal.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    order.orderCode,
                                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppTheme.primaryTeal),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  order.customerName,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark),
                                ),
                                const SizedBox(width: 8),
                                Text('• ${order.customerPhone}', style: const TextStyle(fontSize: 13, color: AppTheme.textMuted)),
                              ],
                            ),
                            Text(
                              currencyFormat.format(order.totalAmount),
                              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppTheme.primaryTeal),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Customer address & note
                        if (order.customerAddress.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 4),
                            child: Row(
                              children: [
                                const Icon(Icons.location_on_outlined, size: 16, color: Colors.grey),
                                const SizedBox(width: 6),
                                Text(order.customerAddress, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          ),
                        if (order.note.isNotEmpty)
                          Row(
                            children: [
                              const Icon(Icons.note_alt_outlined, size: 16, color: Colors.amber),
                              const SizedBox(width: 6),
                              Text('Ghi chú: ${order.note}', style: TextStyle(fontSize: 12, color: Colors.amber.shade900, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        const Divider(height: 24),

                        // Itemized list table
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: order.items.map<Widget>((item) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 2),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '• ${item.name} (${item.quantity} ${item.unit})',
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                                  ),
                                  Text(
                                    currencyFormat.format(item.totalPrice),
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 16),

                        // Card Actions Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Thời gian tạo: ${DateFormat('HH:mm:ss - dd/MM/yyyy').format(order.createdAt)}',
                              style: const TextStyle(fontSize: 11, color: Colors.grey),
                            ),
                            Row(
                              children: [
                                if (order.printStatus == 'waiting' && order.orderStatus != 'cancelled')
                                  ElevatedButton.icon(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.primaryTeal,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    onPressed: () {
                                      queueProvider.addJob(order.id, order.orderCode, order.customerName, null);
                                      orderProvider.markOrderAsPrinted(order.id);
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Đã gửi lệnh in cho đơn hàng ${order.orderCode}')),
                                      );
                                    },
                                    icon: const Icon(Icons.print_rounded, size: 16, color: Colors.white),
                                    label: const Text('In ngay', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 12)),
                                  ),
                                const SizedBox(width: 8),
                                OutlinedButton.icon(
                                  style: OutlinedButton.styleFrom(
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                  ),
                                  onPressed: () {
                                    widget.onNavigate('/preview');
                                  },
                                  icon: const Icon(Icons.visibility_outlined, size: 16),
                                  label: const Text('Xem trước', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                ),
                                const SizedBox(width: 8),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 20),
                                  onPressed: () {
                                    showDialog(
                                      context: context,
                                      builder: (ctx) => ConfirmDialog(
                                        title: 'Xác nhận xóa đơn hàng',
                                        message: 'Bạn có chắc muốn xóa đơn hàng ${order.orderCode} khỏi hệ thống không?',
                                        onConfirm: () {
                                          orderProvider.deleteOrder(order.id);
                                        },
                                      ),
                                    );
                                  },
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
        ],
      ),
    );
  }

  Widget _buildTabButton(String tabKey, String title, IconData icon, Color activeColor) {
    final isSelected = _activeTab == tabKey;

    return InkWell(
      borderRadius: BorderRadius.circular(10),
      onTap: () {
        setState(() {
          _activeTab = tabKey;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? activeColor.withValues(alpha: 0.1) : Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: isSelected ? activeColor : AppTheme.borderLight, width: isSelected ? 1.5 : 1),
        ),
        child: Row(
          children: [
            Icon(icon, size: 18, color: isSelected ? activeColor : AppTheme.textMuted),
            const SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                color: isSelected ? activeColor : AppTheme.textDark,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

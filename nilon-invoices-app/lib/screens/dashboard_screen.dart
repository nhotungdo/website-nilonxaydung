import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';
import '../services/mock_data_service.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String _selectedTab = 'Tất cả';

  void _showCreateOrderModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => const _CreateOrderDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();
    final orders = orderProvider.orders;

    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    // KPI Metrics calculation
    final totalOrdersCount = orders.length;
    final totalRevenue = orders.fold<double>(0, (sum, item) => sum + item.totalAmount);
    final waitingOrders = orders.where((o) => o.printStatus == 'waiting' && o.orderStatus != 'cancelled').length;

    // Filter orders
    final filteredOrders = orders.where((o) {
      if (_selectedTab == 'Chờ xử lý' || _selectedTab == 'Pending') return o.orderStatus == 'pending';
      if (_selectedTab == 'Đã thanh toán' || _selectedTab == 'Paid') return o.orderStatus == 'paid';
      if (_selectedTab == 'Đã in' || _selectedTab == 'Printed') return o.printStatus == 'printed';
      if (_selectedTab == 'Đã hủy' || _selectedTab == 'Canceled') return o.orderStatus == 'cancelled';
      return true;
    }).toList();

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
                  Text(
                    'Tổng quan kinh doanh & In ấn',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                  ),
                  Text(
                    'Chào mừng Quản trị viên! Giám sát hệ thống và điều hành kinh doanh trực tiếp.',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                  ),
                ],
              );

              final actionSection = ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryTeal,
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => _showCreateOrderModal(context),
                icon: const Icon(Icons.add_rounded, color: Colors.white, size: 20),
                label: const Text('Tạo đơn hàng mới', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
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
                  const SizedBox(width: 16),
                  actionSection,
                ],
              );
            },
          ),
          const SizedBox(height: 24),

          // KPI Cards Grid
          LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: ConstrainedBox(
                  constraints: BoxConstraints(minWidth: constraints.maxWidth),
                  child: Row(
                    children: [
                  SizedBox(
                    width: 220,
                    child: _KpiCard(
                      title: 'TỔNG ĐƠN HÀNG THÁNG',
                      value: '$totalOrdersCount đơn',
                      subtitle: '↗ +12% so với tháng trước',
                      icon: Icons.shopping_bag_outlined,
                      iconColor: Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 16),
                  SizedBox(
                    width: 220,
                    child: _KpiCard(
                      title: 'DOANH THU THÁNG NÀY',
                      value: currencyFormat.format(totalRevenue),
                      subtitle: '↗ Tăng trưởng 18.5%',
                      icon: Icons.account_balance_wallet_outlined,
                      iconColor: Colors.green,
                    ),
                  ),
                  const SizedBox(width: 16),
                  SizedBox(
                    width: 220,
                    child: _KpiCard(
                      title: 'ĐƠN CHỜ IN',
                      value: '$waitingOrders đơn',
                      subtitle: 'Sẵn sàng đẩy hàng đợi',
                      icon: Icons.print_outlined,
                      iconColor: Colors.amber.shade800,
                    ),
                  ),
                  const SizedBox(width: 16),
                  SizedBox(
                    width: 220,
                    child: _KpiCard(
                      title: 'TỶ LỆ IN THÀNH CÔNG',
                      value: '99.2%',
                      subtitle: 'Spooler hoạt động ổn định',
                      icon: Icons.check_circle_outline_rounded,
                      iconColor: AppTheme.primaryTeal,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
          const SizedBox(height: 24),

          // Orders Table Section
          GlassCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Filter Tabs & Title
                LayoutBuilder(
                  builder: (context, constraints) {
                    final isMobile = constraints.maxWidth < 650;
                    
                    final titleWidget = const Text(
                      'Danh sách đơn hàng phát sinh',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    );

                    final tabsWidget = SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: ['Tất cả', 'Chờ xử lý', 'Đã thanh toán', 'Đã in', 'Đã hủy'].map((tab) {
                          final isSelected = _selectedTab == tab;
                          return Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: ChoiceChip(
                              label: Text(
                                tab,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                  color: isSelected ? Colors.white : AppTheme.textDark,
                                ),
                              ),
                              selected: isSelected,
                              selectedColor: AppTheme.primaryTeal,
                              backgroundColor: Colors.grey.shade100,
                              onSelected: (val) {
                                if (val) {
                                  setState(() {
                                    _selectedTab = tab;
                                  });
                                }
                              },
                            ),
                          );
                        }).toList(),
                      ),
                    );

                    if (isMobile) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          titleWidget,
                          const SizedBox(height: 10),
                          tabsWidget,
                        ],
                      );
                    }

                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(child: titleWidget),
                        const SizedBox(width: 12),
                        Flexible(child: tabsWidget),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 16),

                // Table
                if (filteredOrders.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: Center(
                      child: Text('Không có đơn hàng nào trong danh mục này.', style: TextStyle(color: Colors.grey)),
                    ),
                  )
                else
                  LayoutBuilder(
                    builder: (context, constraints) {
                      return SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: ConstrainedBox(
                          constraints: BoxConstraints(minWidth: constraints.maxWidth),
                          child: DataTable(
                        headingRowColor: WidgetStateProperty.all(const Color(0xFFF8FAFC)),
                        columns: const [
                          DataColumn(label: Text('MÃ ĐƠN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                          DataColumn(label: Text('KHÁCH HÀNG', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                          DataColumn(label: Text('SỐ ĐIỆN THOẠI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                          DataColumn(label: Text('TỔNG TIỀN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                          DataColumn(label: Text('THANH TOÁN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                          DataColumn(label: Text('TRẠNG THÁI IN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                          DataColumn(label: Text('THỜI GIAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11))),
                        ],
                        rows: filteredOrders.map((order) {
                          final isPrinted = order.printStatus == 'printed';
                          final statusBg = isPrinted ? Colors.green.shade50 : Colors.amber.shade50;
                          final statusTextClr = isPrinted ? Colors.green.shade800 : Colors.amber.shade800;

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
                              DataCell(
                                Text(
                                  currencyFormat.format(order.totalAmount),
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ),
                              DataCell(
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.blue.shade50,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    order.paymentMethod,
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blue.shade800),
                                  ),
                                ),
                              ),
                              DataCell(
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: statusBg,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    isPrinted ? 'Đã in' : 'Chờ in',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: statusTextClr,
                                    ),
                                  ),
                                ),
                              ),
                              DataCell(
                                Text(
                                  DateFormat('HH:mm - dd/MM/yyyy').format(order.createdAt),
                                  style: const TextStyle(fontSize: 11, color: Colors.grey),
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
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _KpiCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color iconColor;

  const _KpiCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.textMuted, letterSpacing: 0.5),
                ),
              ),
              const SizedBox(width: 4),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.textDark),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
          ),
        ],
      ),
    );
  }
}

class _CreateOrderDialog extends StatefulWidget {
  const _CreateOrderDialog();

  @override
  State<_CreateOrderDialog> createState() => _CreateOrderDialogState();
}

class _CreateOrderDialogState extends State<_CreateOrderDialog> {
  final _customerNameCtrl = TextEditingController();
  final _customerPhoneCtrl = TextEditingController();
  final _customerAddressCtrl = TextEditingController();
  final _noteCtrl = TextEditingController();
  String _paymentMethod = 'COD';
  late String _orderCode;

  List<Map<String, dynamic>> _selectedItems = [];
  final catalog = MockDataService.getProductCatalog();

  @override
  void initState() {
    super.initState();
    _orderCode = context.read<OrderProvider>().generateOrderCode();
    _selectedItems = [
      {'name': catalog[0]['name'], 'price': catalog[0]['price'], 'quantity': 1, 'unit': catalog[0]['unit']}
    ];
  }

  double get _calculatedTotal {
    return _selectedItems.fold<double>(0, (sum, item) {
      final price = (item['price'] as num).toDouble();
      final qty = (item['quantity'] as num).toInt();
      return sum + (price * qty);
    });
  }

  void _submitOrder() async {
    if (_customerNameCtrl.text.isEmpty || _customerPhoneCtrl.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng điền Tên khách hàng và Số điện thoại.')),
      );
      return;
    }

    final orderItems = _selectedItems.map((item) {
      return OrderItemModel(
        name: item['name'].toString(),
        quantity: (item['quantity'] as num).toInt(),
        price: (item['price'] as num).toDouble(),
        unit: item['unit'].toString(),
      );
    }).toList();

    final orderProvider = context.read<OrderProvider>();
    final success = await orderProvider.createOrder(
      orderCode: _orderCode,
      customerName: _customerNameCtrl.text,
      customerPhone: _customerPhoneCtrl.text,
      customerAddress: _customerAddressCtrl.text,
      totalAmount: _calculatedTotal,
      note: _noteCtrl.text,
      paymentMethod: _paymentMethod,
      items: orderItems,
    );

    if (success && mounted) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Đơn hàng $_orderCode đã được tạo thành công!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        width: 680,
        padding: const EdgeInsets.all(28),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryTeal.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.add_shopping_cart_rounded, color: AppTheme.primaryTeal, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Tạo đơn hàng thủ công', overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                              Text('Mã đơn hàng: $_orderCode', overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: AppTheme.primaryTeal, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const Divider(height: 32),

              // Customer info grid
              LayoutBuilder(
                builder: (context, constraints) {
                  final isNarrow = constraints.maxWidth < 450;
                  final nameField = TextField(
                    controller: _customerNameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tên khách hàng *',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  );
                  final phoneField = TextField(
                    controller: _customerPhoneCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Số điện thoại *',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  );

                  if (isNarrow) {
                    return Column(
                      children: [
                        nameField,
                        const SizedBox(height: 16),
                        phoneField,
                      ],
                    );
                  }

                  return Row(
                    children: [
                      Expanded(child: nameField),
                      const SizedBox(width: 16),
                      Expanded(child: phoneField),
                    ],
                  );
                },
              ),
              const SizedBox(height: 16),

              TextField(
                controller: _customerAddressCtrl,
                decoration: const InputDecoration(
                  labelText: 'Địa chỉ giao hàng',
                  border: OutlineInputBorder(),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 16),

              LayoutBuilder(
                builder: (context, constraints) {
                  final isNarrow = constraints.maxWidth < 450;
                  final paymentField = DropdownButtonFormField<String>(
                    initialValue: _paymentMethod,
                    decoration: const InputDecoration(labelText: 'Phương thức thanh toán', border: OutlineInputBorder(), isDense: true),
                    items: const [
                      DropdownMenuItem(value: 'COD', child: Text('COD (Tiền mặt khi nhận)')),
                      DropdownMenuItem(value: 'Chuyển khoản', child: Text('Chuyển khoản Ngân hàng')),
                      DropdownMenuItem(value: 'Tiền mặt', child: Text('Tiền mặt tại quầy')),
                    ],
                    onChanged: (val) {
                      setState(() {
                        _paymentMethod = val ?? 'COD';
                      });
                    },
                  );
                  final noteField = TextField(
                    controller: _noteCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Ghi chú đơn hàng',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  );

                  if (isNarrow) {
                    return Column(
                      children: [
                        paymentField,
                        const SizedBox(height: 16),
                        noteField,
                      ],
                    );
                  }

                  return Row(
                    children: [
                      Expanded(child: paymentField),
                      const SizedBox(width: 16),
                      Expanded(child: noteField),
                    ],
                  );
                },
              ),
              const SizedBox(height: 24),

              // Items Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Flexible(
                    child: Text('Danh sách vật tư / sản phẩm', overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      setState(() {
                        _selectedItems.add({
                          'name': catalog[0]['name'],
                          'price': catalog[0]['price'],
                          'quantity': 1,
                          'unit': catalog[0]['unit'],
                        });
                      });
                    },
                    icon: const Icon(Icons.add_circle_outline_rounded, size: 18),
                    label: const Text('Thêm dòng sản phẩm'),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Item rows
              ..._selectedItems.asMap().entries.map((entry) {
                final idx = entry.key;
                final item = entry.value;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: DropdownButtonFormField<String>(
                          initialValue: item['name'].toString(),
                          decoration: const InputDecoration(border: OutlineInputBorder(), isDense: true),
                          items: catalog.map((cat) {
                            return DropdownMenuItem(
                              value: cat['name'].toString(),
                              child: Text(cat['name'].toString(), overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12)),
                            );
                          }).toList(),
                          onChanged: (val) {
                            final selectedCat = catalog.firstWhere((c) => c['name'] == val);
                            setState(() {
                              _selectedItems[idx]['name'] = selectedCat['name'];
                              _selectedItems[idx]['price'] = selectedCat['price'];
                              _selectedItems[idx]['unit'] = selectedCat['unit'];
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        flex: 1,
                        child: TextFormField(
                          initialValue: item['quantity'].toString(),
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(labelText: 'Số lượng', border: OutlineInputBorder(), isDense: true),
                          onChanged: (val) {
                            setState(() {
                              _selectedItems[idx]['quantity'] = int.tryParse(val) ?? 1;
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        flex: 2,
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Text(
                            currencyFormat.format((item['price'] as num) * (item['quantity'] as num)),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                      ),
                      if (_selectedItems.length > 1)
                        IconButton(
                          icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 20),
                          onPressed: () {
                            setState(() {
                              _selectedItems.removeAt(idx);
                            });
                          },
                        ),
                    ],
                  ),
                );
              }),

              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.primaryTeal.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.primaryTeal.withValues(alpha: 0.2)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Tổng tiền đơn hàng:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    Flexible(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          currencyFormat.format(_calculatedTotal),
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 20, color: AppTheme.primaryTeal),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Hủy bỏ', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 12),
                  Flexible(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryTeal),
                      onPressed: _submitOrder,
                      child: const Text(
                        'Tạo đơn & Lưu hệ thống',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

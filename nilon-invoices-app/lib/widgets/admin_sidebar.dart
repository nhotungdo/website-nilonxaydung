import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'confirm_dialog.dart';

class AdminSidebarItem {
  final String title;
  final String route;
  final IconData icon;
  final bool adminOnly;

  AdminSidebarItem({
    required this.title,
    required this.route,
    required this.icon,
    this.adminOnly = false,
  });
}

class AdminSidebar extends StatelessWidget {
  final String currentRoute;
  final Function(String route) onSelectRoute;

  const AdminSidebar({
    super.key,
    required this.currentRoute,
    required this.onSelectRoute,
  });

  @override
  Widget build(BuildContext context) {
    final items = [
      AdminSidebarItem(title: 'Bảng điều khiển', route: '/dashboard', icon: Icons.dashboard_outlined),
      AdminSidebarItem(title: 'Đơn hàng realtime', route: '/orders', icon: Icons.trending_up_rounded),
      AdminSidebarItem(title: 'Hàng đợi in', route: '/queue', icon: Icons.layers_outlined),
      AdminSidebarItem(title: 'Cài đặt máy in', route: '/printers', icon: Icons.print_outlined, adminOnly: true),
      AdminSidebarItem(title: 'Lịch sử đơn hàng', route: '/history', icon: Icons.history_rounded),
      AdminSidebarItem(title: 'Xem trước hóa đơn', route: '/preview', icon: Icons.receipt_long_outlined),
      AdminSidebarItem(title: 'Cài đặt hệ thống', route: '/settings', icon: Icons.settings_outlined, adminOnly: true),
      AdminSidebarItem(title: 'Hỗ trợ kỹ thuật', route: '/support', icon: Icons.help_outline_rounded, adminOnly: true),
    ];

    return Container(
      width: 240,
      color: AppTheme.sidebarBg,
      child: Column(
        children: [
          // Header / Brand Logo
          Container(
            height: 80,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            alignment: Alignment.centerLeft,
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppTheme.borderLight, width: 1)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryTeal,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.receipt_rounded, color: Colors.white, size: 20),
                    ),
                    const SizedBox(width: 10),
                    const Text(
                      'Nilon Invoices',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.primaryTeal,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.only(left: 36, top: 2),
                  child: Text(
                    'ADMIN PORTAL v1.0',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                  ),
                ),
              ],
            ),
          ),

          // Menu list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                final isActive = currentRoute == item.route;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(10),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(10),
                      onTap: () => onSelectRoute(item.route),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isActive ? Colors.white.withValues(alpha: 0.7) : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                          border: isActive ? Border.all(color: AppTheme.borderLight, width: 1) : null,
                        ),
                        child: Row(
                          children: [
                            Icon(
                              item.icon,
                              size: 20,
                              color: isActive ? AppTheme.primaryTeal : AppTheme.textMuted,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                item.title,
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: isActive ? FontWeight.bold : FontWeight.w600,
                                  color: isActive ? AppTheme.primaryTeal : AppTheme.textDark,
                                ),
                              ),
                            ),
                            if (item.adminOnly)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryTeal.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Text(
                                  'ADMIN',
                                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppTheme.primaryTeal),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Logout Footer
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppTheme.borderLight, width: 1)),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(10),
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (ctx) => ConfirmDialog(
                      title: 'Xác nhận đăng xuất',
                      message: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Admin không?',
                      confirmText: 'Đăng xuất',
                      onConfirm: () {
                        context.read<AuthProvider>().logout();
                      },
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: const [
                      Icon(Icons.logout_rounded, size: 20, color: Colors.redAccent),
                      SizedBox(width: 12),
                      Text(
                        'Đăng xuất Admin',
                        style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Colors.redAccent),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

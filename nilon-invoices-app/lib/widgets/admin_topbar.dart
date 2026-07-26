import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/queue_provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';

class AdminTopbar extends StatelessWidget {
  final String title;

  const AdminTopbar({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    final queueProvider = context.watch<QueueProvider>();
    final user = context.watch<AuthProvider>().currentUser;
    final formattedDate = DateFormat("'Ngày' dd 'Tháng' MM, yyyy", 'vi_VN').format(DateTime.now());

    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppTheme.borderLight, width: 1)),
      ),
      child: Row(
        children: [
          // Title
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(width: 24),

          // Search input
          Expanded(
            child: SizedBox(
              width: 320,
              height: 36,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F0FE),
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Row(
                  children: const [
                    Icon(Icons.search_rounded, size: 18, color: Colors.grey),
                    SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Tìm kiếm đơn hàng, khách hàng...',
                          hintStyle: TextStyle(fontSize: 12, color: Colors.grey),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: EdgeInsets.zero,
                        ),
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(width: 16),

          // Date Text
          Text(
            formattedDate,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
          ),

          const SizedBox(width: 16),

          // Pause / Resume Print Button
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: queueProvider.isPaused ? Colors.amber.shade700 : AppTheme.primaryTeal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              queueProvider.togglePause();
            },
            child: Text(
              queueProvider.isPaused ? 'Tiếp tục in' : 'Tạm dừng in',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ),

          const SizedBox(width: 16),

          // Bell notification
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, color: AppTheme.textMuted, size: 22),
                onPressed: () {},
              ),
              Positioned(
                right: 12,
                top: 12,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.redAccent,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(width: 8),
          const VerticalDivider(indent: 16, endIndent: 16, color: AppTheme.borderLight),
          const SizedBox(width: 8),

          // Admin User Profile
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: AppTheme.primaryTeal.withValues(alpha: 0.1),
                child: const Icon(Icons.admin_panel_settings_rounded, size: 18, color: AppTheme.primaryTeal),
              ),
              const SizedBox(width: 8),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    user?.username ?? 'Admin',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const Text(
                    'Quản trị viên',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.primaryTeal),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

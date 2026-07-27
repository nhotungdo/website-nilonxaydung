import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/queue_provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';

class AdminTopbar extends StatelessWidget {
  final String title;
  final VoidCallback? onMenuPressed;

  const AdminTopbar({super.key, required this.title, this.onMenuPressed});

  @override
  Widget build(BuildContext context) {
    final queueProvider = context.watch<QueueProvider>();
    final user = context.watch<AuthProvider>().currentUser;
    final formattedDate = DateFormat("'Ngày' dd 'Tháng' MM, yyyy", 'vi_VN').format(DateTime.now());

    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppTheme.borderLight, width: 1)),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isNarrow = constraints.maxWidth < 650;
          final isVeryNarrow = constraints.maxWidth < 450;

          return Row(
            children: [
              if (onMenuPressed != null) ...[
                IconButton(
                  icon: const Icon(Icons.menu_rounded, color: AppTheme.textDark),
                  onPressed: onMenuPressed,
                  tooltip: 'Mở danh mục',
                ),
                const SizedBox(width: 4),
              ],

              // Title
              Expanded(
                child: Text(
                  title,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                  style: TextStyle(
                    fontSize: isVeryNarrow ? 14 : 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textDark,
                  ),
                ),
              ),

              // Search input (hidden on very narrow screens to prevent 0.0 overflow)
              if (!isVeryNarrow) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    height: 36,
                    constraints: const BoxConstraints(maxWidth: 320),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F0FE),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Row(
                      children: [
                        const Icon(Icons.search_rounded, size: 18, color: Colors.grey),
                        if (!isNarrow) ...[
                          const SizedBox(width: 8),
                          const Expanded(
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
                      ],
                    ),
                  ),
                ),
              ],

              const SizedBox(width: 8),

              // Right Side Control Bar
              Flexible(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Date Text (only on wide screens)
                      if (!isNarrow) ...[
                        Text(
                          formattedDate,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                        ),
                        const SizedBox(width: 8),
                      ],

                      // Pause / Resume Print Button
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: queueProvider.isPaused ? Colors.amber.shade700 : AppTheme.primaryTeal,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          visualDensity: VisualDensity.compact,
                        ),
                        onPressed: () {
                          queueProvider.togglePause();
                        },
                        child: Text(
                          queueProvider.isPaused ? 'Tiếp tục in' : 'Dừng in',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                      const SizedBox(width: 6),

                      // Bell notification
                      IconButton(
                        icon: const Icon(Icons.notifications_outlined, color: AppTheme.textMuted, size: 20),
                        onPressed: () {},
                        visualDensity: VisualDensity.compact,
                      ),

                      if (!isVeryNarrow) ...[
                        const SizedBox(width: 2),
                        const VerticalDivider(indent: 18, endIndent: 18, color: AppTheme.borderLight),
                        const SizedBox(width: 2),

                        // Admin User Profile
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircleAvatar(
                              radius: 14,
                              backgroundColor: AppTheme.primaryTeal.withValues(alpha: 0.1),
                              child: const Icon(Icons.admin_panel_settings_rounded, size: 16, color: AppTheme.primaryTeal),
                            ),
                            if (!isNarrow) ...[
                              const SizedBox(width: 6),
                              Text(
                                user?.username ?? 'Quản trị viên',
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

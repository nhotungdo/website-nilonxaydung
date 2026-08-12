import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/system_notification_provider.dart';
import '../theme/app_theme.dart';

class NotificationsDialog extends StatelessWidget {
  final Function(String route)? onNavigate;

  const NotificationsDialog({super.key, this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final notificationProvider = context.watch<SystemNotificationProvider>();
    final notifications = notificationProvider.notifications;

    return Dialog(
      alignment: Alignment.topRight,
      insetPadding: const EdgeInsets.only(top: 64, right: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 8,
      child: Container(
        width: 380,
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.8,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppTheme.borderLight)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Text(
                        'Thông báo',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                      ),
                      if (notificationProvider.unreadCount > 0) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.redAccent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${notificationProvider.unreadCount} mới',
                            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ],
                  ),
                  if (notifications.isNotEmpty)
                    TextButton(
                      onPressed: () {
                        notificationProvider.markAllAsRead();
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: const Size(0, 0),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: const Text(
                        'Đánh dấu đã đọc',
                        style: TextStyle(fontSize: 12, color: AppTheme.primaryTeal, fontWeight: FontWeight.w600),
                      ),
                    ),
                ],
              ),
            ),

            // List
            Flexible(
              child: notifications.isEmpty
                  ? const Padding(
                      padding: EdgeInsets.all(32),
                      child: Text(
                        'Bạn chưa có thông báo nào.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                      ),
                    )
                  : ListView.separated(
                      shrinkWrap: true,
                      itemCount: notifications.length,
                      separatorBuilder: (context, index) => const Divider(height: 1, color: AppTheme.borderLight),
                      itemBuilder: (context, index) {
                        final notif = notifications[index];
                        final isUnread = !notif.isRead;

                        Color iconColor;
                        IconData iconData;
                        switch (notif.type) {
                          case 'error':
                            iconColor = Colors.redAccent;
                            iconData = Icons.error_rounded;
                            break;
                          case 'warning':
                            iconColor = Colors.orangeAccent;
                            iconData = Icons.warning_rounded;
                            break;
                          case 'success':
                            iconColor = Colors.green;
                            iconData = Icons.check_circle_rounded;
                            break;
                          default:
                            iconColor = AppTheme.primaryTeal;
                            iconData = Icons.info_rounded;
                        }

                        return Dismissible(
                          key: Key(notif.id),
                          direction: DismissDirection.endToStart,
                          background: Container(
                            color: Colors.redAccent,
                            alignment: Alignment.centerRight,
                            padding: const EdgeInsets.only(right: 20),
                            child: const Icon(Icons.delete_outline_rounded, color: Colors.white, size: 28),
                          ),
                          confirmDismiss: (direction) async {
                            return await showDialog<bool>(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                title: const Text('Xác nhận xóa', style: TextStyle(fontWeight: FontWeight.bold)),
                                content: const Text('Bạn có chắc chắn muốn xóa thông báo này không?'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.of(ctx).pop(false),
                                    child: const Text('Hủy', style: TextStyle(color: AppTheme.textMuted)),
                                  ),
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.redAccent,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    onPressed: () => Navigator.of(ctx).pop(true),
                                    child: const Text('Xóa', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ),
                            );
                          },
                          onDismissed: (direction) {
                            notificationProvider.deleteNotification(notif.id);
                          },
                          child: InkWell(
                            onTap: () {
                              if (isUnread) {
                                notificationProvider.markAsRead(notif.id);
                              }
                              if (notif.payloadRoute != null && onNavigate != null) {
                                Navigator.of(context).pop(); // Close dialog
                                onNavigate!(notif.payloadRoute!);
                              }
                            },
                            child: Container(
                              color: isUnread ? Colors.blue.withValues(alpha: 0.05) : Colors.transparent,
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Icon(iconData, color: iconColor, size: 24),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          notif.title,
                                          style: TextStyle(
                                            fontWeight: isUnread ? FontWeight.bold : FontWeight.w600,
                                            fontSize: 14,
                                            color: AppTheme.textDark,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          notif.message,
                                          style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          DateFormat('HH:mm - dd/MM/yyyy').format(notif.createdAt),
                                          style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                                        ),
                                      ],
                                    ),
                                  ),
                                  if (isUnread)
                                    Container(
                                      width: 8,
                                      height: 8,
                                      margin: const EdgeInsets.only(top: 8),
                                      decoration: const BoxDecoration(
                                        color: AppTheme.primaryTeal,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                ],
                              ),
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
}

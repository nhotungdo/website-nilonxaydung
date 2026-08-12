import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/queue_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class PrintQueueScreen extends StatelessWidget {
  const PrintQueueScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final queueProvider = context.watch<QueueProvider>();
    final jobs = queueProvider.jobs;

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
                    'Hàng đợi in tự động',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
                  ),
                  Text(
                    'Giám sát và điều khiển luồng lệnh in hóa đơn tự động.',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                  ),
                ],
              );

              final actionSection = ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: queueProvider.isPaused ? Colors.amber.shade700 : AppTheme.primaryTeal,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  queueProvider.togglePause();
                },
                icon: Icon(queueProvider.isPaused ? Icons.play_arrow_rounded : Icons.pause_rounded, color: Colors.white),
                label: Text(
                  queueProvider.isPaused ? 'Tiếp tục hàng đợi' : 'Tạm dừng hàng đợi',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                ),
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
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: jobs.length,
              separatorBuilder: (ctx, idx) => const Divider(height: 1),
              itemBuilder: (context, index) {
                final job = jobs[index];

                Color statusColor;
                String statusText;
                IconData statusIcon;

                switch (job.status) {
                  case 'PROCESSING':
                    statusColor = Colors.blue;
                    statusText = 'Đang in...';
                    statusIcon = Icons.sync_rounded;
                    break;
                  case 'SUCCESS':
                    statusColor = Colors.green;
                    statusText = 'Hoàn thành';
                    statusIcon = Icons.check_circle_outline_rounded;
                    break;
                  case 'FAILED':
                    statusColor = Colors.redAccent;
                    statusText = 'Lỗi kết nối';
                    statusIcon = Icons.error_outline_rounded;
                    break;
                  default:
                    statusColor = Colors.amber.shade800;
                    statusText = 'Chờ xử lý';
                    statusIcon = Icons.schedule_rounded;
                }

                Future<bool?> confirmDelete() => showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        title: const Row(
                          children: [
                            Icon(Icons.warning_amber_rounded, color: Colors.redAccent, size: 26),
                            SizedBox(width: 10),
                            Text('Xác nhận xóa', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                        content: Text(
                          'Bạn có chắc muốn xóa lệnh in\n"${job.orderCode} — ${job.customerName}"\nkhỏi hàng đợi không?',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: const Text('Hủy', style: TextStyle(color: Colors.grey)),
                          ),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.redAccent,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            onPressed: () => Navigator.pop(ctx, true),
                            icon: const Icon(Icons.delete_outline_rounded, size: 16, color: Colors.white),
                            label: const Text('Xóa', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    );

                return Dismissible(
                  key: ValueKey(job.id),
                  direction: DismissDirection.endToStart,
                  confirmDismiss: (_) => confirmDelete(),
                  onDismissed: (_) {
                    queueProvider.deleteJob(job.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Đã xóa lệnh in "${job.orderCode}" khỏi hàng đợi'),
                        backgroundColor: Colors.redAccent,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    );
                  },
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFFFF6B6B), Color(0xFFEE0979)],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                    ),
                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.delete_sweep_rounded, color: Colors.white, size: 28),
                        SizedBox(height: 4),
                        Text('Xóa', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                      final isMobile = constraints.maxWidth < 600;

                      final statusBadge = Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: statusColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          statusText,
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: statusColor),
                        ),
                      );

                      final actionButtons = Wrap(
                        spacing: 4,
                        runSpacing: 4,
                        children: [
                          if (job.status == 'FAILED')
                            IconButton(
                              icon: const Icon(Icons.refresh_rounded, color: Colors.blue),
                              onPressed: () {
                                queueProvider.retryJob(job.id);
                              },
                              tooltip: 'Thử lại',
                              visualDensity: VisualDensity.compact,
                            ),
                          IconButton(
                            icon: const Icon(Icons.vertical_align_top_rounded, color: AppTheme.primaryTeal),
                            onPressed: () {
                              queueProvider.prioritizeJob(job.id);
                            },
                            tooltip: 'Ưu tiên lên đầu',
                            visualDensity: VisualDensity.compact,
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent),
                            onPressed: () {
                              queueProvider.deleteJob(job.id);
                            },
                            tooltip: 'Xóa khỏi hàng đợi',
                            visualDensity: VisualDensity.compact,
                          ),
                        ],
                      );

                      if (isMobile) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: statusColor.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(statusIcon, color: statusColor, size: 22),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        job.orderCode,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primaryTeal),
                                      ),
                                      Text(
                                        job.customerName,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                                      ),
                                    ],
                                  ),
                                ),
                                statusBadge,
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    'Máy in: ${job.printerName ?? "HP LaserJet 9000"} • ${DateFormat("HH:mm:ss").format(job.createdAt)}',
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                                  ),
                                ),
                                actionButtons,
                              ],
                            ),
                          ],
                        );
                      }

                      return Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(statusIcon, color: statusColor, size: 22),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      job.orderCode,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primaryTeal),
                                    ),
                                    const SizedBox(width: 8),
                                    Flexible(
                                      child: Text(
                                        '• ${job.customerName}',
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Máy in target: ${job.printerName ?? "HP LaserJet 9000"}  •  ${DateFormat("HH:mm:ss").format(job.createdAt)}',
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                                ),
                              ],
                            ),
                          ),
                          statusBadge,
                          const SizedBox(width: 16),
                          actionButtons,
                        ],
                      );
                    },
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

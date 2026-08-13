import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/app_settings_model.dart';
import '../providers/settings_provider.dart';
import '../services/notification_service.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late TextEditingController _apiUrlCtrl;
  late TextEditingController _branchIdCtrl;
  late TextEditingController _apiKeyCtrl;

  late bool _autoPrint;
  late bool _soundAlert;
  late bool _runOnStartup;

  @override
  void initState() {
    super.initState();
    final settings = context.read<SettingsProvider>().settings;
    _apiUrlCtrl = TextEditingController(text: settings.apiUrl);
    _branchIdCtrl = TextEditingController(text: settings.branchId);
    _apiKeyCtrl = TextEditingController(text: settings.apiKey);
    _autoPrint = settings.autoPrint;
    _soundAlert = settings.soundAlert;
    _runOnStartup = settings.runOnStartup;
  }

  @override
  void dispose() {
    _apiUrlCtrl.dispose();
    _branchIdCtrl.dispose();
    _apiKeyCtrl.dispose();
    super.dispose();
  }

  void _saveSettings() async {
    final settingsProvider = context.read<SettingsProvider>();
    final newSettings = AppSettingsModel(
      apiUrl: _apiUrlCtrl.text,
      branchId: _branchIdCtrl.text,
      apiKey: _apiKeyCtrl.text,
      autoPrint: _autoPrint,
      soundAlert: _soundAlert,
      runOnStartup: _runOnStartup,
    );

    final success = await settingsProvider.updateSettings(newSettings);
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cài đặt hệ thống đã được lưu thành công!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final settingsProvider = context.watch<SettingsProvider>();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            'Cài đặt hệ thống Admin',
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
                      'Cấu hình thông số kết nối máy chủ trung tâm, bảo mật API và thiết lập tự động hóa.',
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryTeal,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: settingsProvider.isSaving ? null : _saveSettings,
                icon: const Icon(Icons.save_rounded, color: Colors.white),
                label: Text(
                  settingsProvider.isSaving ? 'Đang lưu...' : 'Lưu thay đổi',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          LayoutBuilder(
            builder: (context, constraints) {
              final isNarrow = constraints.maxWidth < 750;

              final leftColumn = Column(
                children: [
                  GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.dns_rounded, color: Colors.blue),
                            SizedBox(width: 8),
                            Text('Kết nối Máy chủ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                        const Divider(height: 24),

                        TextField(
                          controller: _apiUrlCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Đường dẫn API (Máy chủ trung tâm)',
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        TextField(
                          controller: _branchIdCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Mã chi nhánh (Branch ID)',
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        TextField(
                          controller: _apiKeyCtrl,
                          obscureText: true,
                          decoration: const InputDecoration(
                            labelText: 'Khóa bảo mật API (API Key)',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.power_settings_new_rounded, color: Colors.grey),
                            SizedBox(width: 8),
                            Text('Khởi động hệ thống', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                        const Divider(height: 24),

                        SwitchListTile(
                          title: const Text('Khởi động cùng Windows', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          subtitle: const Text('Tự động bật ứng dụng khi máy tính khởi động.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                          value: _runOnStartup,
                          activeThumbColor: AppTheme.primaryTeal,
                          onChanged: (val) => setState(() => _runOnStartup = val),
                        ),
                      ],
                    ),
                  ),
                ],
              );

              final rightColumn = Column(
                children: [
                  GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.print_rounded, color: Colors.amber),
                            SizedBox(width: 8),
                            Text('Thiết lập In ấn tự động', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                        const Divider(height: 24),

                        SwitchListTile(
                          title: const Text('Tự động in hóa đơn mới', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          subtitle: const Text('Gửi thẳng lệnh in khi nhận đơn hàng mới từ máy chủ.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                          value: _autoPrint,
                          activeThumbColor: AppTheme.primaryTeal,
                          onChanged: (val) => setState(() => _autoPrint = val),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.volume_up_rounded, color: Colors.pinkAccent),
                            SizedBox(width: 8),
                            Text('Âm thanh & Cảnh báo', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                        const Divider(height: 24),

                        SwitchListTile(
                          title: const Text('Cảnh báo bằng âm thanh', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          subtitle: const Text('Phát âm thanh chuông khi có đơn hàng mới hoặc sự cố in.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                          value: _soundAlert,
                          activeThumbColor: AppTheme.primaryTeal,
                          onChanged: (val) => setState(() => _soundAlert = val),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.notifications_active_rounded, color: AppTheme.primaryTeal),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Thông báo Đẩy Điện thoại (Push Notification)',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 24),
                        const Text(
                          'Kiểm tra tính năng phát âm thanh, rung và hiển thị banner thông báo đơn hàng mới trên thanh trạng thái thiết bị.',
                          style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryTeal,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () async {
                            final messenger = ScaffoldMessenger.of(context);
                            final success = await NotificationService.sendTestNotification();
                            if (mounted) {
                              messenger.showSnackBar(
                                SnackBar(
                                  backgroundColor: success ? AppTheme.primaryTeal : Colors.red,
                                  content: Text(
                                    success
                                        ? '🔔 Đã bắn thông báo thử nghiệm thành công tới điện thoại!'
                                        : '❌ Lỗi gửi thông báo thử nghiệm. Vui lòng cấp quyền thông báo!',
                                  ),
                                ),
                              );
                            }
                          },
                          icon: const Icon(Icons.vibration_rounded, color: Colors.white, size: 18),
                          label: const Text('Gửi thông báo thử nghiệm', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Danger Zone Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.red.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('VÙNG NGUY HIỂM', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.redAccent)),
                        const SizedBox(height: 4),
                        const Text(
                          'Đặt lại dữ liệu ứng dụng sẽ xóa toàn bộ cài đặt cục bộ và nhật ký spooler. Thận trọng!',
                          style: TextStyle(fontSize: 11, color: Colors.red),
                        ),
                        const SizedBox(height: 12),
                        OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.redAccent,
                            side: const BorderSide(color: Colors.redAccent),
                          ),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Đã xóa bộ nhớ cache cục bộ thành công.')),
                            );
                          },
                          child: const Text('Xóa bộ nhớ cache', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ],
                    ),
                  ),
                ],
              );

              if (isNarrow) {
                return Column(
                  children: [
                    leftColumn,
                    const SizedBox(height: 16),
                    rightColumn,
                  ],
                );
              }

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: leftColumn),
                  const SizedBox(width: 24),
                  Expanded(child: rightColumn),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

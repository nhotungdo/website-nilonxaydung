import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final faqs = [
      {
        'q': 'Tại sao máy in không nhận lệnh?',
        'a': 'Vui lòng kiểm tra cáp kết nối USB/LAN. Hãy đảm bảo máy in đã được bật nguồn và còn giấy in. Sau đó, vào phần "Cài đặt máy in" để kiểm tra trạng thái kết nối.'
      },
      {
        'q': 'Tôi muốn in lại hóa đơn thì làm thế nào?',
        'a': 'Bạn có thể vào tab "Đơn hàng realtime" hoặc "Lịch sử đơn hàng", tìm kiếm mã đơn và nhấn vào biểu tượng máy in để gửi lại lệnh.'
      },
      {
        'q': 'Lỗi "Printer offline" là gì?',
        'a': 'Đây là lỗi phổ biến khi máy tính không thể giao tiếp với máy in. Hãy thử rút cáp USB ra cắm lại, khởi động lại ứng dụng hoặc cập nhật driver máy in.'
      },
      {
        'q': 'Làm sao để đổi kích thước giấy in sang K58 hoặc K80?',
        'a': 'Vào phần "Cài đặt máy in", chọn máy in mặc định và chọn kích thước giấy tương ứng (K58 - 58mm hoặc K80 - 80mm).'
      }
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Text(
                'Hỗ trợ kỹ thuật & Hướng dẫn',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textDark),
              ),
              SizedBox(width: 8),
              Chip(
                label: Text('ADMIN ONLY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                backgroundColor: AppTheme.primaryTeal,
                padding: EdgeInsets.zero,
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
          const SizedBox(height: 24),

          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left Column: Emergency Contacts
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryTeal,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: const [
                          BoxShadow(color: Color(0x33005B52), blurRadius: 16, offset: Offset(0, 6)),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Cần hỗ trợ gấp?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(height: 4),
                          const Text(
                            'Bộ phận kỹ thuật Nilon Xây Dựng hoạt động 24/7 để xử lý các sự cố khẩn cấp.',
                            style: TextStyle(fontSize: 12, color: Colors.white70),
                          ),
                          const SizedBox(height: 20),

                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: const [
                                Icon(Icons.phone_in_talk_rounded, color: Colors.greenAccent, size: 24),
                                SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('HOTLINE KỸ THUẬT', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white70)),
                                    Text('090 123 4567', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),

                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0068FF),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: const [
                                Icon(Icons.chat_rounded, color: Colors.white, size: 24),
                                SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('ZALO SUPPORT', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white70)),
                                    Text('Chat Kỹ Thuật Viên', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    GlassCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('THÔNG TIN EMAIL', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                          SizedBox(height: 8),
                          Text('Báo lỗi hệ thống: support@nilonxaydung.vn', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
                          SizedBox(height: 4),
                          Text('Kinh doanh / Mở rộng: sales@nilonxaydung.vn', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.primaryTeal)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 24),

              // Right Column: FAQ & App Updates
              Expanded(
                flex: 2,
                child: Column(
                  children: [
                    GlassCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.menu_book_rounded, color: Colors.blue),
                              SizedBox(width: 8),
                              Text('Câu hỏi thường gặp (FAQ)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const Divider(height: 24),

                          ...faqs.map((faq) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: Container(
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  color: AppTheme.bgCanvas,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppTheme.borderLight),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Q: ${faq['q']}',
                                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      'A: ${faq['a']}',
                                      style: const TextStyle(fontSize: 12, color: AppTheme.textMuted, height: 1.4),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    Row(
                      children: [
                        Expanded(
                          child: GlassCard(
                            backgroundColor: Colors.amber.shade50,
                            border: Border.all(color: Colors.amber.shade200),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: const [
                                    Icon(Icons.bug_report_rounded, color: Colors.amber),
                                    SizedBox(width: 8),
                                    Text('Gửi báo cáo lỗi', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.brown)),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                const Text(
                                  'Tự động thu thập nhật ký in khi gặp sự cố để kỹ thuật xử lý nhanh hơn.',
                                  style: TextStyle(fontSize: 11, color: Colors.brown),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: GlassCard(
                            backgroundColor: Colors.blue.shade50,
                            border: Border.all(color: Colors.blue.shade200),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: const [
                                    Icon(Icons.system_update_rounded, color: Colors.blue),
                                    SizedBox(width: 8),
                                    Text('Cập nhật phần mềm', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.blue)),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                const Text(
                                  'Phiên bản hiện tại: v1.2.4 (Mới nhất cho Admin).',
                                  style: TextStyle(fontSize: 11, color: Colors.blue),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

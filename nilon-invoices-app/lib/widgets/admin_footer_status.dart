import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/printer_provider.dart';
import '../theme/app_theme.dart';

class AdminFooterStatus extends StatelessWidget {
  const AdminFooterStatus({super.key});

  @override
  Widget build(BuildContext context) {
    final printerProvider = context.watch<PrinterProvider>();
    final defaultPrinter = printerProvider.defaultPrinter;

    return Container(
      height: 36,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: const BoxDecoration(
        color: Color(0xFFEBF3FC),
        border: Border(top: BorderSide(color: AppTheme.borderLight, width: 1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              // Socket IO status
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppTheme.colorEmerald,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              RichText(
                text: const TextSpan(
                  style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                  children: [
                    TextSpan(text: 'Socket.IO: '),
                    TextSpan(text: 'Connected', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              const Text('|', style: TextStyle(color: AppTheme.borderLight)),
              const SizedBox(width: 12),
              RichText(
                text: const TextSpan(
                  style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                  children: [
                    TextSpan(text: 'DB Cluster: '),
                    TextSpan(text: '01', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              const Text('|', style: TextStyle(color: AppTheme.borderLight)),
              const SizedBox(width: 12),
              RichText(
                text: TextSpan(
                  style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                  children: [
                    const TextSpan(text: 'Default Printer: '),
                    TextSpan(
                      text: defaultPrinter != null
                          ? '${defaultPrinter.name} (${defaultPrinter.status})'
                          : 'HP LaserJet 9000 (Online)',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    ),
                  ],
                ),
              ),
            ],
          ),
          Row(
            children: const [
              Text('Documentation', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
              SizedBox(width: 12),
              Text('|', style: TextStyle(color: AppTheme.borderLight)),
              SizedBox(width: 12),
              Text('System Logs', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
            ],
          ),
        ],
      ),
    );
  }
}

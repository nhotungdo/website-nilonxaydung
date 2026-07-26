import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'providers/order_provider.dart';
import 'providers/printer_provider.dart';
import 'providers/queue_provider.dart';
import 'providers/settings_provider.dart';

import 'theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/realtime_orders_screen.dart';
import 'screens/print_queue_screen.dart';
import 'screens/printers_screen.dart';
import 'screens/invoice_preview_screen.dart';
import 'screens/order_history_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/support_screen.dart';

import 'widgets/admin_sidebar.dart';
import 'widgets/admin_topbar.dart';
import 'widgets/admin_footer_status.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NilonInvoicesAdminApp());
}

class NilonInvoicesAdminApp extends StatelessWidget {
  const NilonInvoicesAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
        ChangeNotifierProvider(create: (_) => PrinterProvider()),
        ChangeNotifierProvider(create: (_) => QueueProvider()),
        ChangeNotifierProvider(create: (_) => SettingsProvider()),
      ],
      child: MaterialApp(
        title: 'Nilon Invoices Admin App',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const AppShell(),
      ),
    );
  }
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  String _currentRoute = '/dashboard';

  void _onNavigate(String route) {
    setState(() {
      _currentRoute = route;
    });
  }

  String _getPageTitle(String route) {
    switch (route) {
      case '/dashboard':
        return 'Bảng điều khiển';
      case '/orders':
        return 'Đơn hàng realtime';
      case '/queue':
        return 'Hàng đợi in';
      case '/printers':
        return 'Cài đặt máy in';
      case '/history':
        return 'Lịch sử đơn hàng';
      case '/preview':
        return 'Xem trước hóa đơn';
      case '/settings':
        return 'Cài đặt hệ thống';
      case '/support':
        return 'Hỗ trợ kỹ thuật';
      default:
        return 'Bảng điều khiển';
    }
  }

  Widget _buildBody(String route) {
    switch (route) {
      case '/dashboard':
        return const DashboardScreen();
      case '/orders':
        return RealtimeOrdersScreen(onNavigate: _onNavigate);
      case '/queue':
        return const PrintQueueScreen();
      case '/printers':
        return const PrintersScreen();
      case '/history':
        return const OrderHistoryScreen();
      case '/preview':
        return const InvoicePreviewScreen();
      case '/settings':
        return const SettingsScreen();
      case '/support':
        return const SupportScreen();
      default:
        return const DashboardScreen();
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    // Route Guard: If not authenticated or not Admin, show LoginScreen
    if (!authProvider.isAuthenticated || authProvider.currentUser == null || !authProvider.currentUser!.isAdmin) {
      return const LoginScreen();
    }

    return Scaffold(
      body: Row(
        children: [
          // Navigation Sidebar
          AdminSidebar(
            currentRoute: _currentRoute,
            onSelectRoute: _onNavigate,
          ),

          // Main View Container
          Expanded(
            child: Column(
              children: [
                // Top Header
                AdminTopbar(title: _getPageTitle(_currentRoute)),

                // Main Page Content
                Expanded(
                  child: Container(
                    color: AppTheme.bgCanvas,
                    child: _buildBody(_currentRoute),
                  ),
                ),

                // Footer Status Bar
                const AdminFooterStatus(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

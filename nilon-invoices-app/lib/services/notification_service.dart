import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/order_model.dart';
import '../models/inventory_item_model.dart';

/// Service quản lý push notification cục bộ cho đơn hàng và tồn kho.
/// Hoạt động trên Android (API 21+) và iOS.
class NotificationService {
  static final FlutterLocalNotificationsPlugin _plugin = FlutterLocalNotificationsPlugin();

  static bool _initialized = false;
  static Function(String route)? onSelectNotificationRoute;

  // Android notification channels
  static const String _orderChannelId = 'nilon_new_orders';
  static const String _orderChannelName = 'Đơn hàng mới';
  static const String _orderChannelDesc = 'Thông báo khi có đơn hàng mới từ khách';

  static const String _stockChannelId = 'nilon_stock_alerts';
  static const String _stockChannelName = 'Cảnh báo tồn kho';
  static const String _stockChannelDesc = 'Thông báo khi sản phẩm trong kho chạm mức cảnh báo min';

  // ─────────────────────────────────────────────
  // INITIALIZE — Gọi 1 lần trong main()
  // ─────────────────────────────────────────────
  static Future<void> initialize({Function(String route)? onNavigate}) async {
    if (_initialized) return;

    if (onNavigate != null) {
      onSelectNotificationRoute = onNavigate;
    }

    const AndroidInitializationSettings androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTap,
    );

    await _createAndroidChannels();
    await _requestAndroidPermission();

    _initialized = true;
    debugPrint('[NotificationService] Initialized successfully with channels');
  }

  static Future<void> _requestAndroidPermission() async {
    final androidPlugin = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    if (androidPlugin != null) {
      final granted = await androidPlugin.requestNotificationsPermission();
      debugPrint('[NotificationService] Android permission granted: $granted');
    }
  }

  static Future<void> _createAndroidChannels() async {
    final androidPlugin = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    if (androidPlugin == null) return;

    const AndroidNotificationChannel orderChannel = AndroidNotificationChannel(
      _orderChannelId,
      _orderChannelName,
      description: _orderChannelDesc,
      importance: Importance.high,
      playSound: true,
      enableVibration: true,
    );

    const AndroidNotificationChannel stockChannel = AndroidNotificationChannel(
      _stockChannelId,
      _stockChannelName,
      description: _stockChannelDesc,
      importance: Importance.high,
      playSound: true,
      enableVibration: true,
    );

    await androidPlugin.createNotificationChannel(orderChannel);
    await androidPlugin.createNotificationChannel(stockChannel);
  }

  // ─────────────────────────────────────────────
  // HIỂN THỊ THÔNG BÁO ĐƠN HÀNG MỚI
  // ─────────────────────────────────────────────
  static Future<void> showNewOrderNotification(OrderModel order) async {
    if (!_initialized) await initialize();

    final amount = _formatCurrency(order.totalAmount);

    final NotificationDetails details = NotificationDetails(
      android: AndroidNotificationDetails(
        _orderChannelId,
        _orderChannelName,
        channelDescription: _orderChannelDesc,
        importance: Importance.high,
        priority: Priority.high,
        icon: '@mipmap/ic_launcher',
        playSound: true,
        enableVibration: true,
        styleInformation: BigTextStyleInformation(
          '👤 Khách: ${order.customerName}\n'
          '📦 ${order.items.length} sản phẩm\n'
          '📍 ${order.customerAddress.isNotEmpty ? order.customerAddress : "Chưa có địa chỉ"}',
          contentTitle: '🛍️ Đơn hàng mới • ${order.orderCode}',
          summaryText: amount,
        ),
      ),
      iOS: const DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    final notificationId = order.id.hashCode.abs() % 100000;

    await _plugin.show(
      notificationId,
      '🛍️ Đơn hàng mới! ${order.orderCode}',
      '${order.customerName} • $amount',
      details,
      payload: '/orders',
    );

    debugPrint('[NotificationService] Shown order notification: ${order.orderCode}');
  }

  // ─────────────────────────────────────────────
  // HIỂN THỊ THÔNG BÁO CẢNH BÁO TỒN KHO THẤP
  // ─────────────────────────────────────────────
  static Future<void> showLowStockNotification(InventoryItemModel item) async {
    if (!_initialized) await initialize();

    final NotificationDetails details = NotificationDetails(
      android: AndroidNotificationDetails(
        _stockChannelId,
        _stockChannelName,
        channelDescription: _stockChannelDesc,
        importance: Importance.high,
        priority: Priority.high,
        icon: '@mipmap/ic_launcher',
        playSound: true,
        enableVibration: true,
        styleInformation: BigTextStyleInformation(
          '⚠️ Sản phẩm: ${item.name} (SKU: ${item.sku})\n'
          '📉 Mức tồn hiện tại: ${item.currentStock.toStringAsFixed(0)} ${item.unit}\n'
          '🚨 Mức cảnh báo min: ${item.minStockAlert.toStringAsFixed(0)} ${item.unit}\n'
          'Vui lòng lập phiếu nhập kho bổ sung!',
          contentTitle: '⚠️ CẢNH BÁO HẾT KHO!',
        ),
      ),
      iOS: const DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    final notificationId = (item.id.hashCode.abs() + 50000) % 100000;

    await _plugin.show(
      notificationId,
      '⚠️ Cảnh báo tồn kho: ${item.name}',
      'Tồn hiện tại: ${item.currentStock.toStringAsFixed(0)} ${item.unit} (Min: ${item.minStockAlert.toStringAsFixed(0)})',
      details,
      payload: '/inventory',
    );

    debugPrint('[NotificationService] Shown low stock alert: ${item.sku}');
  }

  // ─────────────────────────────────────────────
  // GỬI THÔNG BÁO THỬ NGHIỆM TỚI ĐIỆN THOẠI
  // ─────────────────────────────────────────────
  static Future<bool> sendTestNotification() async {
    if (!_initialized) await initialize();

    try {
      const NotificationDetails details = NotificationDetails(
        android: AndroidNotificationDetails(
          _orderChannelId,
          _orderChannelName,
          channelDescription: _orderChannelDesc,
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
          playSound: true,
          enableVibration: true,
          styleInformation: BigTextStyleInformation(
            '🔔 Hệ thống thông báo đẩy Nilon Invoices đang hoạt động hoàn hảo trên điện thoại!\n'
            'Thời gian kiểm tra: Vừa xong.\n'
            'Rung & Âm thanh báo đơn hàng đã sẵn sàng.',
            contentTitle: '✅ THÔNG BÁO THỬ NGHIỆM THÀNH CÔNG',
          ),
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      );

      final notificationId = DateTime.now().millisecondsSinceEpoch % 100000;

      await _plugin.show(
        notificationId,
        '✅ Nilon Invoices • Thông báo thử nghiệm',
        'Kiểm tra tính năng rung và chuông thông báo trên điện thoại',
        details,
        payload: '/dashboard',
      );

      debugPrint('[NotificationService] Test notification sent successfully');
      return true;
    } catch (e) {
      debugPrint('[NotificationService] Test notification error: $e');
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // XỬ LÝ KHI NGƯỜI DÙNG TAP VÀO NOTIFICATION
  // ─────────────────────────────────────────────
  static void _onNotificationTap(NotificationResponse response) {
    debugPrint('[NotificationService] Notification tapped, payload: ${response.payload}');
    if (response.payload != null && response.payload!.isNotEmpty) {
      onSelectNotificationRoute?.call(response.payload!);
    }
  }

  static String _formatCurrency(double amount) {
    final formatted = amount.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]}.',
        );
    return '$formatted₫';
  }
}

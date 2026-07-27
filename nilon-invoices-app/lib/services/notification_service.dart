import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/order_model.dart';

/// Service quản lý local push notification cho đơn hàng mới.
/// Hoạt động trên Android (API 21+) và iOS.
class NotificationService {
  static final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  static bool _initialized = false;

  // Android notification channel
  static const String _channelId = 'nilon_new_orders';
  static const String _channelName = 'Đơn hàng mới';
  static const String _channelDesc = 'Thông báo khi có đơn hàng mới từ khách';

  // ─────────────────────────────────────────────
  // INITIALIZE — Gọi 1 lần trong main()
  // ─────────────────────────────────────────────
  static Future<void> initialize() async {
    if (_initialized) return;

    // Android settings
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    // iOS settings — xin quyền thông báo khi khởi tạo
    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings(
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

    // Tạo notification channel cho Android 8+
    await _createAndroidChannel();

    // Xin quyền POST_NOTIFICATIONS trên Android 13+
    await _requestAndroidPermission();

    _initialized = true;
    debugPrint('[NotificationService] Initialized successfully');
  }

  // ─────────────────────────────────────────────
  // XIN QUYỀN ANDROID 13+
  // ─────────────────────────────────────────────
  static Future<void> _requestAndroidPermission() async {
    final androidPlugin =
        _plugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();
    if (androidPlugin != null) {
      final granted = await androidPlugin.requestNotificationsPermission();
      debugPrint('[NotificationService] Android permission granted: $granted');
    }
  }

  // ─────────────────────────────────────────────
  // TẠO NOTIFICATION CHANNEL (Android 8.0+)
  // ─────────────────────────────────────────────
  static Future<void> _createAndroidChannel() async {
    const AndroidNotificationChannel channel = AndroidNotificationChannel(
      _channelId,
      _channelName,
      description: _channelDesc,
      importance: Importance.high,
      playSound: true,
      enableVibration: true,
    );

    await _plugin
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);
  }

  // ─────────────────────────────────────────────
  // HIỂN THỊ THÔNG BÁO ĐƠN HÀNG MỚI
  // ─────────────────────────────────────────────
  static Future<void> showNewOrderNotification(OrderModel order) async {
    if (!_initialized) {
      debugPrint('[NotificationService] Not initialized, skipping notification');
      return;
    }

    // Format số tiền đẹp
    final amount = _formatCurrency(order.totalAmount);

    final NotificationDetails details = NotificationDetails(
      android: AndroidNotificationDetails(
        _channelId,
        _channelName,
        channelDescription: _channelDesc,
        importance: Importance.high,
        priority: Priority.high,
        icon: '@mipmap/ic_launcher',
        playSound: true,
        enableVibration: true,
        styleInformation: BigTextStyleInformation(
          '👤 Khách: ${order.customerName}\n'
          '📦 ${order.items.length} sản phẩm\n'
          '📍 ${order.customerAddress.isNotEmpty ? order.customerAddress : "Không có địa chỉ"}',
          contentTitle: '🛍️ Đơn mới • ${order.orderCode}',
          summaryText: amount,
        ),
      ),
      iOS: const DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    // Dùng hashCode của order ID để làm notification ID duy nhất
    final notificationId = order.id.hashCode.abs() % 100000;

    await _plugin.show(
      notificationId,
      '🛍️ Đơn hàng mới! ${order.orderCode}',
      '${order.customerName} • $amount',
      details,
      payload: order.id,
    );

    debugPrint(
        '[NotificationService] Shown notification for order: ${order.orderCode}');
  }

  // ─────────────────────────────────────────────
  // XỬ LÝ KHI NGƯỜI DÙNG TAP VÀO NOTIFICATION
  // ─────────────────────────────────────────────
  static void _onNotificationTap(NotificationResponse response) {
    debugPrint('[NotificationService] Notification tapped, payload: ${response.payload}');
    // TODO: Điều hướng đến màn hình đơn hàng nếu cần
  }

  // ─────────────────────────────────────────────
  // FORMAT TIỀN VIỆT NAM
  // ─────────────────────────────────────────────
  static String _formatCurrency(double amount) {
    final formatted = amount
        .toStringAsFixed(0)
        .replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]}.',
        );
    return '$formatted₫';
  }
}

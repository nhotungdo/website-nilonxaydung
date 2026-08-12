import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/system_notification_model.dart';

class SystemNotificationProvider extends ChangeNotifier {
  // Static event bus for dispatching notifications from anywhere (e.g. other providers)
  static final StreamController<SystemNotificationModel> _eventBus = StreamController<SystemNotificationModel>.broadcast();
  
  static void dispatch(SystemNotificationModel notification) {
    _eventBus.add(notification);
  }

  final List<SystemNotificationModel> _notifications = [];
  
  List<SystemNotificationModel> get notifications => List.unmodifiable(_notifications);
  
  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  SystemNotificationProvider() {
    _loadFromPrefs();

    // Listen to global events
    _eventBus.stream.listen((notif) {
      _addNotification(notif);
    });
  }

  Future<void> _loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('system_notifications');
    if (data != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(data);
        _notifications.clear();
        _notifications.addAll(jsonList.map((e) => SystemNotificationModel.fromJson(e)).toList());
        notifyListeners();
      } catch (e) {
        debugPrint('[SystemNotificationProvider] Error loading notifications: $e');
      }
    } else {
      // Add a welcome notification only if it's the very first time
      _addNotification(SystemNotificationModel(
        title: 'Chào mừng trở lại',
        message: 'Hệ thống Nilon Invoices đã sẵn sàng hoạt động.',
        type: 'success',
      ));
    }
  }

  Future<void> _saveToPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = _notifications.map((e) => e.toJson()).toList();
    await prefs.setString('system_notifications', jsonEncode(jsonList));
  }

  void _addNotification(SystemNotificationModel notification) {
    // Insert at the beginning (newest first)
    _notifications.insert(0, notification);
    
    // Limit history to 100 items to save memory
    if (_notifications.length > 100) {
      _notifications.removeLast();
    }
    notifyListeners();
    _saveToPrefs();
  }

  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index >= 0 && !_notifications[index].isRead) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      notifyListeners();
      _saveToPrefs();
    }
  }

  void markAllAsRead() {
    bool hasChanges = false;
    for (int i = 0; i < _notifications.length; i++) {
      if (!_notifications[i].isRead) {
        _notifications[i] = _notifications[i].copyWith(isRead: true);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      notifyListeners();
      _saveToPrefs();
    }
  }

  void deleteNotification(String id) {
    _notifications.removeWhere((n) => n.id == id);
    notifyListeners();
    _saveToPrefs();
  }

  void clearAll() {
    _notifications.clear();
    notifyListeners();
    _saveToPrefs();
  }
  
  @override
  void dispose() {
    // Note: Do not close _eventBus here if you want it to live across provider rebuilds
    // But since it's a static broadcast stream, it's fine.
    super.dispose();
  }
}

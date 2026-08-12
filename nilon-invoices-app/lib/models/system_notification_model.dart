import 'package:uuid/uuid.dart';

class SystemNotificationModel {
  final String id;
  final String title;
  final String message;
  final String type; // 'info', 'warning', 'error', 'success'
  final DateTime createdAt;
  final bool isRead;
  final String? payloadRoute;

  SystemNotificationModel({
    String? id,
    required this.title,
    required this.message,
    this.type = 'info',
    DateTime? createdAt,
    this.isRead = false,
    this.payloadRoute,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  SystemNotificationModel copyWith({
    String? id,
    String? title,
    String? message,
    String? type,
    DateTime? createdAt,
    bool? isRead,
    String? payloadRoute,
  }) {
    return SystemNotificationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
      isRead: isRead ?? this.isRead,
      payloadRoute: payloadRoute ?? this.payloadRoute,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'createdAt': createdAt.toIso8601String(),
      'isRead': isRead,
      'payloadRoute': payloadRoute,
    };
  }

  factory SystemNotificationModel.fromJson(Map<String, dynamic> json) {
    return SystemNotificationModel(
      id: json['id'] as String?,
      title: json['title'] as String,
      message: json['message'] as String,
      type: json['type'] as String? ?? 'info',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : null,
      isRead: json['isRead'] as bool? ?? false,
      payloadRoute: json['payloadRoute'] as String?,
    );
  }
}

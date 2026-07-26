enum UserRole { admin, staff }

class UserModel {
  final String username;
  final UserRole role;

  UserModel({
    required this.username,
    required this.role,
  });

  bool get isAdmin => role == UserRole.admin;

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      username: json['username'] ?? '',
      role: json['role'] == 'admin' ? UserRole.admin : UserRole.staff,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'role': role == UserRole.admin ? 'admin' : 'staff',
    };
  }
}

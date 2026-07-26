import '../models/user_model.dart';

class AuthResult {
  final bool success;
  final UserModel? user;
  final String? error;

  AuthResult({
    required this.success,
    this.user,
    this.error,
  });
}

class AuthService {
  static Future<AuthResult> login(String username, String password) async {
    // Artificial delay
    await Future.delayed(const Duration(milliseconds: 600));

    if (username.trim() == 'Admin' && password == '123456') {
      return AuthResult(
        success: true,
        user: UserModel(username: 'Admin', role: UserRole.admin),
      );
    }

    if (username.trim() == 'Staff' && password == '123456') {
      return AuthResult(
        success: false,
        user: UserModel(username: 'Staff', role: UserRole.staff),
        error: 'Từ chối truy cập: Tài khoản Nhân viên không có quyền truy cập. Ứng dụng này chỉ dành riêng cho Admin.',
      );
    }

    return AuthResult(
      success: false,
      error: 'Sai tên tài khoản hoặc mật khẩu. Vui lòng kiểm tra lại.',
    );
  }
}

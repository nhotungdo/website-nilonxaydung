import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _currentUser;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _loadUserSession();
  }

  Future<void> _loadUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString('nilon_admin_user');
    if (userJson != null) {
      try {
        final Map<String, dynamic> data = jsonDecode(userJson);
        final user = UserModel.fromJson(data);
        if (user.isAdmin) {
          _currentUser = user;
          _isAuthenticated = true;
          notifyListeners();
        }
      } catch (e) {
        // Session corrupted
      }
    }
  }

  Future<bool> login(String username, String password, bool rememberMe) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final result = await AuthService.login(username, password);

    _isLoading = false;
    if (result.success && result.user != null) {
      if (!result.user!.isAdmin) {
        _errorMessage = 'Tài khoản không phải là Admin. Truy cập bị từ chối.';
        _isAuthenticated = false;
        _currentUser = null;
        notifyListeners();
        return false;
      }

      _currentUser = result.user;
      _isAuthenticated = true;
      _errorMessage = null;

      if (rememberMe) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('nilon_admin_user', jsonEncode(result.user!.toJson()));
      }
      notifyListeners();
      return true;
    } else {
      _errorMessage = result.error ?? 'Đăng nhập thất bại';
      _isAuthenticated = false;
      _currentUser = null;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    _isAuthenticated = false;
    _errorMessage = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('nilon_admin_user');
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}

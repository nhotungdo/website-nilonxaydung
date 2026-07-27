import 'package:flutter/material.dart';
import '../models/printer_model.dart';
import '../services/printer_api_service.dart';

class PrinterProvider extends ChangeNotifier {
  List<PrinterModel> _printers = [];
  bool _isLoading = false;
  String? _error;

  List<PrinterModel> get printers => _printers;
  bool get isLoading => _isLoading;
  String? get error => _error;

  PrinterModel? get defaultPrinter {
    final found = _printers.where((p) => p.isDefault).toList();
    if (found.isNotEmpty) return found.first;
    return _printers.isNotEmpty ? _printers.first : null;
  }

  PrinterProvider() {
    _initialize();
  }

  // ─────────────────────────────────────────────
  // INITIALIZE — Load printers from Supabase
  // ─────────────────────────────────────────────
  Future<void> _initialize() async {
    await fetchPrinters();
  }

  // ─────────────────────────────────────────────
  // FETCH PRINTERS FROM SUPABASE
  // ─────────────────────────────────────────────
  Future<void> fetchPrinters() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _printers = await PrinterApiService.fetchPrinters();
    } catch (e) {
      _error = 'Không thể tải danh sách máy in: $e';
      debugPrint('[PrinterProvider] fetchPrinters error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─────────────────────────────────────────────
  // ADD PRINTER
  // ─────────────────────────────────────────────
  Future<void> addPrinter(PrinterModel printer) async {
    try {
      final saved = await PrinterApiService.addPrinter(printer);
      _printers.add(saved);
      notifyListeners();
    } catch (e) {
      _printers.add(printer); // Optimistic
      notifyListeners();
      debugPrint('[PrinterProvider] addPrinter error: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE PRINTER
  // ─────────────────────────────────────────────
  Future<void> deletePrinter(String id) async {
    _printers.removeWhere((p) => p.id == id);
    notifyListeners();

    try {
      await PrinterApiService.deletePrinter(id);
    } catch (e) {
      debugPrint('[PrinterProvider] deletePrinter error: $e');
      await fetchPrinters(); // Refresh from server
    }
  }

  // ─────────────────────────────────────────────
  // SET DEFAULT PRINTER
  // ─────────────────────────────────────────────
  Future<void> setDefaultPrinter(String id) async {
    _printers = _printers.map((p) {
      return p.copyWith(isDefault: p.id == id);
    }).toList();
    notifyListeners();

    try {
      await PrinterApiService.setDefaultPrinter(id);
    } catch (e) {
      debugPrint('[PrinterProvider] setDefaultPrinter error: $e');
    }
  }

  // ─────────────────────────────────────────────
  // TEST PRINTER (local simulation)
  // ─────────────────────────────────────────────
  Future<bool> testPrinter(String id) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 1200));
    _isLoading = false;
    notifyListeners();
    return true;
  }
}

import 'package:flutter/material.dart';
import '../models/printer_model.dart';
import '../services/mock_data_service.dart';

class PrinterProvider extends ChangeNotifier {
  List<PrinterModel> _printers = [];
  bool _isLoading = false;

  List<PrinterModel> get printers => _printers;
  bool get isLoading => _isLoading;

  PrinterModel? get defaultPrinter {
    final found = _printers.where((p) => p.isDefault).toList();
    if (found.isNotEmpty) return found.first;
    return _printers.isNotEmpty ? _printers.first : null;
  }

  PrinterProvider() {
    _printers = MockDataService.getInitialPrinters();
  }

  void addPrinter(PrinterModel printer) {
    _printers.add(printer);
    notifyListeners();
  }

  void deletePrinter(String id) {
    _printers.removeWhere((p) => p.id == id);
    notifyListeners();
  }

  void setDefaultPrinter(String id) {
    _printers = _printers.map((p) {
      return p.copyWith(isDefault: p.id == id);
    }).toList();
    notifyListeners();
  }

  Future<bool> testPrinter(String id) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 1200));
    _isLoading = false;
    notifyListeners();
    return true;
  }
}

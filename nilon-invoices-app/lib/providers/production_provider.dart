import 'package:flutter/material.dart';
import '../models/production_log_model.dart';
import '../models/inventory_item_model.dart';
import '../services/production_api_service.dart';

class ProductionProvider extends ChangeNotifier {
  List<DailyProductionLogModel> _logs = [];
  bool _isLoading = false;
  String? _error;

  List<DailyProductionLogModel> get logs => _logs;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // KPI Metrics
  double get totalProducedToday => _logs
      .where((log) => _isToday(log.productionDate))
      .fold(0, (sum, log) => sum + log.producedQuantity);

  double get totalWasteToday => _logs
      .where((log) => _isToday(log.productionDate))
      .fold(0, (sum, log) => sum + log.wasteQuantity);

  int get activeShiftsCountToday => _logs
      .where((log) => _isToday(log.productionDate))
      .map((log) => log.shift)
      .toSet()
      .length;

  double get wastePercentageToday {
    final total = totalProducedToday + totalWasteToday;
    if (total == 0) return 0;
    return (totalWasteToday / total) * 100;
  }

  ProductionProvider() {
    fetchLogs();
  }

  bool _isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year && date.month == now.month && date.day == now.day;
  }

  Future<void> fetchLogs() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _logs = await ProductionApiService.fetchProductionLogs();
    } catch (e) {
      _error = 'Không thể tải nhật ký sản xuất: $e';
      debugPrint('[ProductionProvider] fetchLogs error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addProductionLog({
    required DailyProductionLogModel log,
    InventoryItemModel? targetProduct,
  }) async {
    try {
      final created = await ProductionApiService.createProductionLog(
        log: log,
        targetProduct: targetProduct,
      );
      _logs.insert(0, created);
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Không thể ghi nhận ca sản xuất: $e';
      notifyListeners();
      return false;
    }
  }
}

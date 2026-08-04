import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/production_log_model.dart';
import '../models/inventory_item_model.dart';
import '../models/inventory_transaction_model.dart';
import 'supabase_service.dart';

class ProductionApiService {
  static SupabaseClient get _db => SupabaseService.client;

  // ─────────────────────────────────────────────
  // FETCH PRODUCTION LOGS (From Supabase Only)
  // ─────────────────────────────────────────────
  static Future<List<DailyProductionLogModel>> fetchProductionLogs() async {
    try {
      final res = await _db.from('daily_production_logs').select('*').order('created_at', ascending: false);
      return (res as List).map((json) => DailyProductionLogModel.fromJson(json)).toList();
    } catch (e) {
      debugPrint('[ProductionApiService] fetchProductionLogs error: $e');
      rethrow;
    }
  }

  // ─────────────────────────────────────────────
  // CREATE PRODUCTION LOG (Optionally adds to inventory stock)
  // ─────────────────────────────────────────────
  static Future<DailyProductionLogModel> createProductionLog({
    required DailyProductionLogModel log,
    required InventoryItemModel? targetProduct,
  }) async {
    try {
      // 1. Insert production log
      await _db.from('daily_production_logs').insert(log.toJson());

      // 2. If autoAddedToStock & product exists -> update stock & add transaction log
      if (log.autoAddedToStock && targetProduct != null) {
        final newStock = targetProduct.currentStock + log.producedQuantity;
        await _db.from('inventory_items').update({
          'current_stock': newStock,
          'last_updated': DateTime.now().toIso8601String(),
        }).eq('id', targetProduct.id);

        final tx = InventoryTransactionModel(
          id: 'TX-${DateTime.now().millisecondsSinceEpoch}',
          type: 'PRODUCTION_ADD',
          productId: targetProduct.id,
          productName: targetProduct.name,
          quantityChange: log.producedQuantity,
          balanceAfter: newStock,
          referenceCode: log.id,
          notes: 'Tự động nhập kho từ Nhật ký sản xuất (${log.shift} - ${log.machineId})',
          createdAt: DateTime.now(),
          createdBy: log.operatorName,
        );
        await _db.from('inventory_transactions').insert(tx.toJson());
      }

      return log;
    } catch (e) {
      debugPrint('[ProductionApiService] createProductionLog error: $e');
      rethrow;
    }
  }
}

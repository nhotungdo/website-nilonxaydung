import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/print_job_model.dart';
import 'supabase_service.dart';

/// Service to interact with the print_jobs table on Supabase.
class PrintJobApiService {
  static SupabaseClient get _db => SupabaseService.client;

  // ─────────────────────────────────────────────
  // FETCH ALL PRINT JOBS
  // ─────────────────────────────────────────────
  static Future<List<PrintJobModel>> fetchJobs({int limit = 100}) async {
    try {
      final data = await _db
          .from('print_jobs')
          .select('id, order_id, status, created_at, printer_name, orders(order_code, customers(full_name))')
          .order('created_at', ascending: false)
          .limit(limit);

      return data.map((json) => PrintJobModel.fromSupabase(json)).toList();
    } catch (e) {
      throw Exception('[PrintJobApiService] fetchJobs failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // ADD PRINT JOB
  // ─────────────────────────────────────────────
  static Future<PrintJobModel> addJob({
    required String orderId,
    required String orderCode,
    required String customerName,
    String? printerName,
  }) async {
    try {
      final payload = {
        'order_id': orderId,
        'status': 'PENDING',
        'printer_name': printerName ?? 'HP LaserJet 9000 (Kho A)',
        'created_at': DateTime.now().toIso8601String(),
      };

      final data = await _db
          .from('print_jobs')
          .insert(payload)
          .select('id, order_id, status, created_at, printer_name, orders(order_code, customers(full_name))')
          .single();

      return PrintJobModel.fromSupabase(data);
    } catch (e) {
      throw Exception('[PrintJobApiService] addJob failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE PRINT JOB
  // ─────────────────────────────────────────────
  static Future<void> deleteJob(String jobId) async {
    try {
      await _db.from('print_jobs').delete().eq('id', jobId);
    } catch (e) {
      throw Exception('[PrintJobApiService] deleteJob failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE JOB STATUS (retry → PENDING)
  // ─────────────────────────────────────────────
  static Future<void> updateStatus(String jobId, String status) async {
    try {
      await _db
          .from('print_jobs')
          .update({'status': status})
          .eq('id', jobId);
    } catch (e) {
      throw Exception('[PrintJobApiService] updateStatus failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // PRIORITIZE JOB (move to top by updating created_at)
  // ─────────────────────────────────────────────
  static Future<void> prioritizeJob(String jobId) async {
    try {
      // Set created_at to future so it sorts first
      await _db
          .from('print_jobs')
          .update({'created_at': DateTime.now().add(const Duration(days: 1)).toIso8601String()})
          .eq('id', jobId);
    } catch (e) {
      throw Exception('[PrintJobApiService] prioritizeJob failed: $e');
    }
  }
}

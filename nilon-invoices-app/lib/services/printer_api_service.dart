import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/printer_model.dart';
import 'supabase_service.dart';

/// Service to interact with printers table on Supabase
class PrinterApiService {
  static SupabaseClient get _db => SupabaseService.client;

  // ─────────────────────────────────────────────
  // FETCH ALL PRINTERS
  // ─────────────────────────────────────────────
  static Future<List<PrinterModel>> fetchPrinters() async {
    try {
      final data = await _db
          .from('printers')
          .select()
          .eq('is_active', true)
          .order('is_default', ascending: false)
          .order('created_at', ascending: true);

      return data
          .map((json) => PrinterModel.fromSupabase(json))
          .toList();
    } catch (e) {
      throw Exception('[PrinterApiService] fetchPrinters failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // ADD PRINTER
  // ─────────────────────────────────────────────
  static Future<PrinterModel> addPrinter(PrinterModel printer) async {
    try {
      final data = await _db
          .from('printers')
          .insert(printer.toSupabase())
          .select()
          .single();

      return PrinterModel.fromSupabase(data);
    } catch (e) {
      throw Exception('[PrinterApiService] addPrinter failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE PRINTER
  // ─────────────────────────────────────────────
  static Future<void> updatePrinter(PrinterModel printer) async {
    try {
      await _db
          .from('printers')
          .update(printer.toSupabase())
          .eq('id', printer.id);
    } catch (e) {
      throw Exception('[PrinterApiService] updatePrinter failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // SET DEFAULT PRINTER
  // ─────────────────────────────────────────────
  static Future<void> setDefaultPrinter(String printerId) async {
    try {
      // First, unset all defaults
      await _db.from('printers').update({'is_default': false}).neq('id', '');

      // Then set the selected one as default
      await _db
          .from('printers')
          .update({'is_default': true})
          .eq('id', printerId);
    } catch (e) {
      throw Exception('[PrinterApiService] setDefaultPrinter failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE PRINTER (soft delete — set is_active = false)
  // ─────────────────────────────────────────────
  static Future<void> deletePrinter(String printerId) async {
    try {
      await _db
          .from('printers')
          .update({'is_active': false})
          .eq('id', printerId);
    } catch (e) {
      throw Exception('[PrinterApiService] deletePrinter failed: $e');
    }
  }
}

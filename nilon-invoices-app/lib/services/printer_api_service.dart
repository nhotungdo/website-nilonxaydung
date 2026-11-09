import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/printer_model.dart';
import 'firebase_service.dart';

/// Service to interact with printers collection on Cloud Firestore
class PrinterApiService {
  static FirebaseFirestore get _db => FirebaseService.db;
  static CollectionReference get _printersCol => _db.collection('printers');

  // ─────────────────────────────────────────────
  // FETCH ALL PRINTERS
  // ─────────────────────────────────────────────
  static Future<List<PrinterModel>> fetchPrinters() async {
    try {
      final snap = await _printersCol.get();
      return snap.docs
          .map((doc) => PrinterModel.fromMap(doc.id, doc.data() as Map<String, dynamic>))
          .where((p) => p.status != 'OFFLINE')
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
      final docId = printer.id.isNotEmpty ? printer.id : _printersCol.doc().id;
      final data = printer.toMap();
      data['createdAt'] = FieldValue.serverTimestamp();
      await _printersCol.doc(docId).set(data);
      return printer.copyWith(id: docId);
    } catch (e) {
      throw Exception('[PrinterApiService] addPrinter failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE PRINTER
  // ─────────────────────────────────────────────
  static Future<void> updatePrinter(PrinterModel printer) async {
    try {
      await _printersCol.doc(printer.id).set(printer.toMap(), SetOptions(merge: true));
    } catch (e) {
      throw Exception('[PrinterApiService] updatePrinter failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // SET DEFAULT PRINTER
  // ─────────────────────────────────────────────
  static Future<void> setDefaultPrinter(String printerId) async {
    try {
      final snap = await _printersCol.get();
      final batch = _db.batch();
      for (final doc in snap.docs) {
        batch.update(doc.reference, {'isDefault': doc.id == printerId, 'is_default': doc.id == printerId});
      }
      await batch.commit();
    } catch (e) {
      throw Exception('[PrinterApiService] setDefaultPrinter failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE PRINTER (soft delete)
  // ─────────────────────────────────────────────
  static Future<void> deletePrinter(String printerId) async {
    try {
      await _printersCol.doc(printerId).update({
        'isActive': false,
        'is_active': false,
      });
    } catch (e) {
      throw Exception('[PrinterApiService] deletePrinter failed: $e');
    }
  }
}

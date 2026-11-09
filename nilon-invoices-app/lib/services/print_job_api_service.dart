import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/print_job_model.dart';
import 'firebase_service.dart';

/// Service to interact with the print_jobs collection on Cloud Firestore.
class PrintJobApiService {
  static FirebaseFirestore get _db => FirebaseService.db;
  static CollectionReference get _jobsCol => _db.collection('print_jobs');

  // ─────────────────────────────────────────────
  // FETCH ALL PRINT JOBS
  // ─────────────────────────────────────────────
  static Future<List<PrintJobModel>> fetchJobs({int limit = 100}) async {
    try {
      final snap = await _jobsCol.orderBy('createdAt', descending: true).limit(limit).get();
      return snap.docs
          .map((doc) => PrintJobModel.fromMap(doc.id, doc.data() as Map<String, dynamic>))
          .toList();
    } catch (e) {
      try {
        final snap = await _jobsCol.limit(limit).get();
        return snap.docs
            .map((doc) => PrintJobModel.fromMap(doc.id, doc.data() as Map<String, dynamic>))
            .toList();
      } catch (inner) {
        throw Exception('[PrintJobApiService] fetchJobs failed: $e');
      }
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
        'orderId': orderId,
        'order_id': orderId,
        'orderCode': orderCode,
        'order_code': orderCode,
        'customerName': customerName,
        'customer_name': customerName,
        'status': 'WAITING',
        'printerName': printerName ?? 'Máy in nhiệt K80',
        'createdAt': FieldValue.serverTimestamp(),
      };

      final docRef = await _jobsCol.add(payload);
      return PrintJobModel(
        id: docRef.id,
        orderId: orderId,
        orderCode: orderCode,
        customerName: customerName,
        status: 'WAITING',
        createdAt: DateTime.now(),
        printerName: printerName ?? 'Máy in nhiệt K80',
      );
    } catch (e) {
      throw Exception('[PrintJobApiService] addJob failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE PRINT JOB
  // ─────────────────────────────────────────────
  static Future<void> deleteJob(String jobId) async {
    try {
      await _jobsCol.doc(jobId).delete();
    } catch (e) {
      throw Exception('[PrintJobApiService] deleteJob failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE JOB STATUS
  // ─────────────────────────────────────────────
  static Future<void> updateStatus(String jobId, String status) async {
    try {
      await _jobsCol.doc(jobId).update({'status': status});
    } catch (e) {
      throw Exception('[PrintJobApiService] updateStatus failed: $e');
    }
  }

  // ─────────────────────────────────────────────
  // PRIORITIZE JOB
  // ─────────────────────────────────────────────
  static Future<void> prioritizeJob(String jobId) async {
    try {
      await _jobsCol.doc(jobId).update({
        'createdAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw Exception('[PrintJobApiService] prioritizeJob failed: $e');
    }
  }
}

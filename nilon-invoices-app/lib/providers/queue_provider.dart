import 'package:flutter/material.dart';
import '../models/print_job_model.dart';
import '../services/print_job_api_service.dart';

class QueueProvider extends ChangeNotifier {
  List<PrintJobModel> _jobs = [];
  bool _isPaused = false;
  bool _isLoading = false;
  String? _error;

  List<PrintJobModel> get jobs => _jobs;
  bool get isPaused => _isPaused;
  bool get isLoading => _isLoading;
  String? get error => _error;

  QueueProvider() {
    fetchJobs();
  }

  // ─────────────────────────────────────────────
  // FETCH JOBS FROM SUPABASE
  // ─────────────────────────────────────────────
  Future<void> fetchJobs() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _jobs = await PrintJobApiService.fetchJobs();
    } catch (e) {
      _error = 'Không thể tải hàng đợi in: $e';
      debugPrint('[QueueProvider] fetchJobs error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─────────────────────────────────────────────
  // TOGGLE PAUSE
  // ─────────────────────────────────────────────
  void togglePause() {
    _isPaused = !_isPaused;
    notifyListeners();
  }

  // ─────────────────────────────────────────────
  // ADD JOB
  // ─────────────────────────────────────────────
  Future<void> addJob(
    String orderId,
    String orderCode,
    String customerName,
    String? printerName,
  ) async {
    try {
      final newJob = await PrintJobApiService.addJob(
        orderId: orderId,
        orderCode: orderCode,
        customerName: customerName,
        printerName: printerName,
      );
      _jobs.insert(0, newJob);
      notifyListeners();
    } catch (e) {
      // Optimistic local insert on failure
      _jobs.insert(
        0,
        PrintJobModel(
          id: 'local-${DateTime.now().millisecondsSinceEpoch}',
          orderId: orderId,
          orderCode: orderCode,
          customerName: customerName,
          status: 'PENDING',
          createdAt: DateTime.now(),
          printerName: printerName ?? 'HP LaserJet 9000 (Kho A)',
        ),
      );
      notifyListeners();
      debugPrint('[QueueProvider] addJob error: $e');
    }
  }

  // ─────────────────────────────────────────────
  // RETRY JOB
  // ─────────────────────────────────────────────
  Future<void> retryJob(String jobId) async {
    final index = _jobs.indexWhere((j) => j.id == jobId);
    if (index == -1) return;

    _jobs[index] = _jobs[index].copyWith(status: 'PENDING');
    notifyListeners();

    try {
      await PrintJobApiService.updateStatus(jobId, 'PENDING');
    } catch (e) {
      debugPrint('[QueueProvider] retryJob error: $e');
    }
  }

  // ─────────────────────────────────────────────
  // DELETE JOB
  // ─────────────────────────────────────────────
  Future<void> deleteJob(String jobId) async {
    final prevJobs = List<PrintJobModel>.from(_jobs);
    _jobs.removeWhere((j) => j.id == jobId);
    notifyListeners();

    try {
      await PrintJobApiService.deleteJob(jobId);
    } catch (e) {
      _jobs = prevJobs;
      _error = 'Không thể xóa lệnh in: $e';
      notifyListeners();
      debugPrint('[QueueProvider] deleteJob error: $e');
    }
  }

  // ─────────────────────────────────────────────
  // PRIORITIZE JOB
  // ─────────────────────────────────────────────
  Future<void> prioritizeJob(String jobId) async {
    final index = _jobs.indexWhere((j) => j.id == jobId);
    if (index <= 0) return;

    final job = _jobs.removeAt(index);
    _jobs.insert(0, job);
    notifyListeners();

    try {
      await PrintJobApiService.prioritizeJob(jobId);
    } catch (e) {
      debugPrint('[QueueProvider] prioritizeJob error: $e');
    }
  }
}

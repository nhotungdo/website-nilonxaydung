import 'dart:math';
import 'package:flutter/material.dart';
import '../models/print_job_model.dart';
import '../services/mock_data_service.dart';

class QueueProvider extends ChangeNotifier {
  List<PrintJobModel> _jobs = [];
  bool _isPaused = false;

  List<PrintJobModel> get jobs => _jobs;
  bool get isPaused => _isPaused;

  QueueProvider() {
    _jobs = MockDataService.getInitialPrintJobs();
  }

  void togglePause() {
    _isPaused = !_isPaused;
    notifyListeners();
  }

  void addJob(String orderId, String orderCode, String customerName, String? printerName) {
    final newJob = PrintJobModel(
      id: 'job-${Random().nextInt(9000) + 1000}',
      orderId: orderId,
      orderCode: orderCode,
      customerName: customerName,
      status: 'PENDING',
      createdAt: DateTime.now(),
      printerName: printerName ?? 'HP LaserJet 9000 (Kho A)',
    );
    _jobs.insert(0, newJob);
    notifyListeners();
  }

  void retryJob(String jobId) {
    final index = _jobs.indexWhere((j) => j.id == jobId);
    if (index != -1) {
      _jobs[index] = _jobs[index].copyWith(status: 'PENDING');
      notifyListeners();
    }
  }

  void deleteJob(String jobId) {
    _jobs.removeWhere((j) => j.id == jobId);
    notifyListeners();
  }

  void prioritizeJob(String jobId) {
    final index = _jobs.indexWhere((j) => j.id == jobId);
    if (index > 0) {
      final job = _jobs.removeAt(index);
      _jobs.insert(0, job);
      notifyListeners();
    }
  }
}

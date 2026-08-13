import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

class CurrencyInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    if (newValue.text.isEmpty) {
      return newValue.copyWith(text: '');
    }

    // Only keep digits
    String cleanText = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');

    if (cleanText.isEmpty) {
      return newValue.copyWith(text: '');
    }

    // Format the number using vi_VN locale which uses dot as thousands separator
    final formatter = NumberFormat('#,###', 'vi_VN');
    String formattedText = formatter.format(int.parse(cleanText));

    return newValue.copyWith(
      text: formattedText,
      selection: TextSelection.collapsed(offset: formattedText.length),
    );
  }
}

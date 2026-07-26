import 'package:flutter_test/flutter_test.dart';
import 'package:nilon_invoices_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NilonInvoicesAdminApp());
    expect(find.text('Nilon Invoices'), findsOneWidget);
  });
}

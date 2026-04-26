import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, content } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ tên và số điện thoại' },
        { status: 400 }
      );
    }

    // In a real application, you would send an email, save to database, or forward to a webhook here.
    console.log('New Contact Request:', { name, phone, content });

    // Mock successful delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: 'Yêu cầu đã được gửi thành công' }, { status: 200 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

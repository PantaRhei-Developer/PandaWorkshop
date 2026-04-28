import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';
import { getIngredientCategories } from '@/lib/firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    await verifyIdToken(token);
    const categories = await getIngredientCategories();

    return NextResponse.json({
      data: categories,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Get categories error:', error);

    if (error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get ingredient categories', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

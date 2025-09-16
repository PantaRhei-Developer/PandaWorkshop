import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';
import { getIngredientsByCategory } from '@/lib/firebase/firestore';

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

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const allIngredients = await getIngredientsByCategory(categoryId);
    
    // Apply pagination
    const paginatedIngredients = allIngredients.slice(offset, offset + limit);

    return NextResponse.json({
      data: {
        items: paginatedIngredients,
        total: allIngredients.length,
        limit,
        offset,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Get ingredients error:', error);

    if (error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get ingredients', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

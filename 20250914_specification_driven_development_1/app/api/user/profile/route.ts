import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';
import { getUserProfile, updateUserProfile } from '@/lib/firebase/firestore';

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    const user = await getUserProfile(decodedToken.uid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: user,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Get profile error:', error);

    if (error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get user profile', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    const updateData = await request.json();

    // Validate update data
    if (updateData.displayName && updateData.displayName.length > 50) {
      return NextResponse.json(
        { error: '表示名は50文字以内で入力してください', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (updateData.profile?.calorieTarget && 
        (updateData.profile.calorieTarget < 300 || updateData.profile.calorieTarget > 1000)) {
      return NextResponse.json(
        { error: 'カロリー目標は300〜1000kcalの範囲で入力してください', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Update user profile
    await updateUserProfile(decodedToken.uid, updateData);

    // Get updated user profile
    const updatedUser = await getUserProfile(decodedToken.uid);

    return NextResponse.json({
      data: updatedUser,
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Update profile error:', error);

    if (error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update user profile', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

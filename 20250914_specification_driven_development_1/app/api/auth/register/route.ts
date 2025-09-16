import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createUserProfile } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();

    // Validate input
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { 
          error: 'メールアドレス、パスワード、表示名は必須です',
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { 
          error: 'パスワードは8文字以上で入力してください',
          code: 'WEAK_PASSWORD' 
        },
        { status: 400 }
      );
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      email: user.email!,
      displayName,
      profile: {
        allergies: [],
        dislikedIngredients: [],
        likedIngredients: [],
        cookingTimePreference: 30,
        spiceLevel: 'normal',
        calorieTarget: 500,
        storageDay: 5,
      },
      notifications: {
        push: {
          enabled: true,
          newRecipe: true,
          weeklyRecipe: true,
          updates: false,
          timeRange: {
            start: '09:00',
            end: '21:00',
          },
        },
        email: {
          enabled: false,
          frequency: 'weekly',
        },
      },
    });

    // Get ID token
    const idToken = await user.getIdToken();

    return NextResponse.json({
      data: {
        uid: user.uid,
        email: user.email,
        displayName,
        idToken,
      },
      message: 'User registered successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { 
          error: 'このメールアドレスは既に使用されています',
          code: 'EMAIL_EXISTS' 
        },
        { status: 409 }
      );
    }

    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { 
          error: 'パスワードが弱すぎます',
          code: 'WEAK_PASSWORD' 
        },
        { status: 400 }
      );
    }

    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { 
          error: 'メールアドレスの形式が正しくありません',
          code: 'INVALID_EMAIL' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'アカウント作成に失敗しました',
        code: 'INTERNAL_SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, Role } from '../types';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: Role,
    department: string
): Promise<User> => {
    try {
        // Create Firebase auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Update display name
        await updateProfile(firebaseUser, { displayName: name });

        // Create user profile in Firestore
        const newUser: User = {
            id: firebaseUser.uid,
            name,
            email,
            role,
            department,
            learningPreference: 'Visual',
            streak: 0,
            xp: 0,
            avgScore: 0,
            hoursLearned: 0
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

        return newUser;
    } catch (error: any) {
        console.error('Error signing up:', error);
        throw new Error(error.message || 'Failed to sign up');
    }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
            throw new Error('User profile not found');
        }

        return userDoc.data() as User;
    } catch (error: any) {
        console.error('Error signing in:', error);
        throw new Error(error.message || 'Failed to sign in');
    }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Check if user profile exists
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (userDoc.exists()) {
            return userDoc.data() as User;
        } else {
            // Create new user profile for first-time Google sign-in
            const newUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                role: 'Employee', // Default role
                department: 'General',
                learningPreference: 'Visual',
                streak: 0,
                xp: 0,
                avgScore: 0,
                hoursLearned: 0
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            return newUser;
        }
    } catch (error: any) {
        console.error('Error signing in with Google:', error);
        throw new Error(error.message || 'Failed to sign in with Google');
    }
};

/**
 * Sign out current user
 */
export const logOut = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        console.error('Error signing out:', error);
        throw new Error(error.message || 'Failed to sign out');
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error('Error sending password reset email:', error);
        throw new Error(error.message || 'Failed to send password reset email');
    }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data() as User;
        }
        return null;
    } catch (error: any) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
    uid: string,
    updates: Partial<User>
): Promise<void> => {
    try {
        await updateDoc(doc(db, 'users', uid), updates as any);
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        throw new Error(error.message || 'Failed to update user profile');
    }
}


/**
 * Get all users from Firestore
 */
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data() as User);
        });
        return users;
    } catch (error: any) {
        console.error('Error getting all users:', error);
        return [];
    }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

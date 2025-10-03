import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, serverTimestamp } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  xp?: number;
  level?: number;
  createdAt?: any;
  updatedAt?: any;
}

export async function ensureUserDoc(uid: string, email: string, displayName: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid,
      email,
      displayName,
      xp: 0,
      level: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function fetchUserDoc(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
}

export async function updateProfile(
  uid: string,
  updates: { displayName?: string; avatarFile?: File }
): Promise<string | null> {
  const userRef = doc(db, "users", uid);
  let photoURL: string | null = null;

  if (updates.avatarFile) {
    const storageRef = ref(storage, `avatars/${uid}/${Date.now()}_${updates.avatarFile.name}`);
    await uploadBytes(storageRef, updates.avatarFile);
    photoURL = await getDownloadURL(storageRef);
  }

  const updateData: any = {
    updatedAt: serverTimestamp(),
  };

  if (updates.displayName) {
    updateData.displayName = updates.displayName;
  }

  if (photoURL) {
    updateData.photoURL = photoURL;
  }

  await updateDoc(userRef, updateData);
  return photoURL;
}

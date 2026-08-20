import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";
import { Deal, AutomationWorkflow, Booking, Review, CallLog, UserSession } from "../types";

// Firebase configuration loaded from project metadata
export const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId,
};

export const firestoreDatabaseId = firebaseConfigJson.firestoreDatabaseId || "(default)";

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with custom database ID if provisioned
export const db =
  firestoreDatabaseId && firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firestoreDatabaseId)
    : getFirestore(app);

// ==========================================
// FIRESTORE SYNC & PERSISTENCE HELPERS
// ==========================================

/**
 * Save or update user profile & subscription state in Firestore
 */
export async function syncUserToFirestore(user: UserSession): Promise<boolean> {
  try {
    if (!user || !user.id) return false;
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore syncUser error (graceful fallback):", error);
    return false;
  }
}

/**
 * Fetch user profile from Firestore by user ID
 */
export async function fetchUserFromFirestore(userId: string): Promise<UserSession | null> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserSession;
    }
    return null;
  } catch (error) {
    console.warn("Firestore fetchUser error:", error);
    return null;
  }
}

/**
 * Save or update a CRM Deal in Firestore
 */
export async function saveDealToFirestore(deal: Deal): Promise<boolean> {
  try {
    const dealRef = doc(db, "deals", deal.id);
    await setDoc(dealRef, {
      ...deal,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore saveDeal error:", error);
    return false;
  }
}

/**
 * Delete a CRM Deal from Firestore
 */
export async function deleteDealFromFirestore(dealId: string): Promise<boolean> {
  try {
    const dealRef = doc(db, "deals", dealId);
    await deleteDoc(dealRef);
    return true;
  } catch (error) {
    console.warn("Firestore deleteDeal error:", error);
    return false;
  }
}

/**
 * Subscribe to real-time updates for Deals
 */
export function subscribeToDeals(callback: (deals: Deal[]) => void) {
  try {
    const dealsCol = collection(db, "deals");
    return onSnapshot(
      dealsCol,
      (snapshot) => {
        const deals: Deal[] = [];
        snapshot.forEach((docSnap) => {
          deals.push({ ...(docSnap.data() as Deal), id: docSnap.id });
        });
        if (deals.length > 0) {
          callback(deals);
        }
      },
      (error) => {
        console.warn("Firestore deals listener warning:", error);
      }
    );
  } catch (e) {
    console.warn("subscribeToDeals error:", e);
    return () => {};
  }
}

/**
 * Save or update an Automation Workflow in Firestore
 */
export async function saveWorkflowToFirestore(workflow: AutomationWorkflow): Promise<boolean> {
  try {
    const wfRef = doc(db, "workflows", workflow.id);
    await setDoc(wfRef, {
      ...workflow,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore saveWorkflow error:", error);
    return false;
  }
}

/**
 * Delete a Workflow from Firestore
 */
export async function deleteWorkflowFromFirestore(workflowId: string): Promise<boolean> {
  try {
    const wfRef = doc(db, "workflows", workflowId);
    await deleteDoc(wfRef);
    return true;
  } catch (error) {
    console.warn("Firestore deleteWorkflow error:", error);
    return false;
  }
}

/**
 * Save or update a Booking appointment in Firestore
 */
export async function saveBookingToFirestore(booking: Booking): Promise<boolean> {
  try {
    const bookingRef = doc(db, "bookings", booking.id);
    await setDoc(bookingRef, {
      ...booking,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore saveBooking error:", error);
    return false;
  }
}

/**
 * Check Firestore connection health
 */
export async function testFirestoreConnection(): Promise<{ connected: boolean; message: string; databaseId: string }> {
  try {
    const testRef = doc(db, "_health", "status");
    await setDoc(testRef, {
      connected: true,
      lastCheck: new Date().toISOString(),
      service: "RevenueOS_Firebase",
    }, { merge: true });
    return {
      connected: true,
      message: "Connected to Firebase Firestore successfully!",
      databaseId: firestoreDatabaseId,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err.message || "Could not write test document to Firestore",
      databaseId: firestoreDatabaseId,
    };
  }
}

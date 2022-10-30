import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink, confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase";
import { useSelector } from 'react-redux'
import app from '../firebase'
import { actionCodeSettings } from "../firebase";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export default function AuthProvider({ children }) {
  const firestore = getFirestore(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const signup = async (email, password, rol, displayName, photoURL, favorites) => {
  const infoUser= await createUserWithEmailAndPassword(auth, email, password)
    
  .then((currentUser)=>{
    return currentUser;
  })
  const docuRefU=doc(firestore, `users/${infoUser.user.uid}`);
  setDoc(docuRefU, {email: email, rol: rol, displayName: displayName, photoURL: photoURL, favorites: favorites});
  };

  const login = async (email, password) => {
    const objeect = await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    const infoGoo= await signInWithPopup(auth, googleProvider)
      .then((currentUser)=>{
        return currentUser;
      })
    const docuRefU=doc(firestore, `users/${infoGoo.user.uid}`);
    setDoc(docuRefU, {email: infoGoo.user.email, rol: 'user', favorites: []});
  };


  const logout = async () => await signOut(auth)

  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

//   const confirmPassword = async (oobCode, newPassword) => await confirmPasswordReset(auth,oobCode, newPassword)

//   const sendE = async (email) => sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
//     window.localStorage.setItem('emailForSignIn', email);
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });

//   const emailLink = async(email)=> signInWithEmailLink(auth, email, emailLink).then(user.credentials)
//   if (isSignInWithEmailLink(auth, window.location.href)) {
//   let email = window.localStorage.getItem('emailForSignIn');
//   if (!email) {
//     email = window.prompt('Please provide your email for confirmation');
//   }
//   signInWithEmailLink(auth, email, window.location.href)
//     .then((result) => {
//       window.localStorage.removeItem('emailForSignIn');
//     })
//     .catch((error) => {
//     });
// }

  useEffect(() => {
    const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log({ currentUser });
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubuscribe();
  }, []);

  return (
    <authContext.Provider value={{ signup, login, user, logout, loading, loginWithGoogle, resetPassword}}>
      {children}
    </authContext.Provider>
  );
}

//, confirmPassword, sendE, emailLink
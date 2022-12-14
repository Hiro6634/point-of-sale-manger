import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    // signInWithRedirect, 
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAX-qkALEtk-Vxdd-4bwU5gXundlcwFGwk",
    authDomain: "pointofsale-ae0fd.firebaseapp.com",
    projectId: "pointofsale-ae0fd",
    storageBucket: "pointofsale-ae0fd.appspot.com",
    messagingSenderId: "855078399227",
    appId: "1:855078399227:web:83d784b43ab9385154145e",
    measurementId: "G-1RSNNYZ9XE"
};
  
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const removeProduct = async (product) => {
    try{
        const docRef = doc(db, "products",product.name.toLowerCase().replace(' ', '_'));
        const batch = writeBatch(db);
       
        const docSnapshot = await getDoc(docRef);
        if(docSnapshot.exists){
            batch.delete(docRef, product);
        }
        await batch.commit();
    }catch(error){
        console.error("ERROR:"+error);
    }
}
export const insertProduct = async (product) => {
    try{
        console.log("ID: " + product.id);
        const docRef = doc(db, "products",product.id);
        const batch = writeBatch(db);
        console.log("product:", product);
        batch.set(docRef, product);
        await batch.commit();
    } catch( error ){
        console.error("ERROR:"+error);
    }
}

export const updateProduct = async (docId, updateDoc) => {
    try{
        console.log("__UPDATE__ ID: " + docId);
        const docRef = doc(db, "products",docId);
        const batch = writeBatch(db);
        const docSnapshot = await getDoc(docRef);
        console.log("docSnapshot:", docSnapshot);
        console.log("docSnapshot Exists:"+ docSnapshot.exists?"TRUE":"FALSE");
        batch.update(docRef, updateDoc);
        await batch.commit();
    } catch( error ){
        console.error("ERROR:"+error);
    }
}

export const getCollectionAndDocuments = async (collectionName) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const productMap = querySnapshot.docs.reduce((acc, docSnapshot)=> {
        const { id } = docSnapshot.data();
        acc[id.toLowerCase()] = docSnapshot.data();
        return acc;
    }, {}); 

    return productMap;
}

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.name.toLowerCase().replace(' ','_'));
        batch.set(docRef, object);
    });

    await batch.commit();
    console.log('Done!');
}

export const createUserDocumentFromAuth = async(userAuth) => {
    const userDocRef = doc(db, 'users', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    if(!userSnapshot.exists()){
        var {displayName, email} = userAuth;
        const createAt = new Date();
        try{
            if( displayName == null ){
                displayName = email.split("@")[0];
            }
            
            await setDoc(userDocRef, {
                displayName,
                email,
                createAt
            });
        }catch(error){
            console.log('error creating the user ', error.message);
        }
    }

    return userDocRef;
}

export const  createAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
}

export const  signInAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => 
    onAuthStateChanged(auth, callback);
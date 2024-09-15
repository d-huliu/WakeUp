// src/firebase.d.ts
declare module "./firebase" {
    import firebase from 'firebase/app';
  export default firebase;
  export * from 'firebase/app';
  export * from 'firebase/auth';
  export * from 'firebase/database';
  export * from 'firebase/storage';
    
    const database: ReturnType<typeof getDatabase>;
    export { database, ref, set, get, child };
}

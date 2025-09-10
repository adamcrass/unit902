// scripts/createAdmin.js
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.VITE_PUBLIC_FIREBASE_SA_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
});

async function createAdmin() {
  const userRecord = await admin.auth().createUser({
    email: "joshua@transpiled.com",
    password: "qwerty",
    displayName: "Joshua Crass",
  });

  await admin.auth().setCustomUserClaims(userRecord.uid, { role: "admin" });

  await admin.database().ref(`users/${userRecord.uid}`).set({
    email: "joshua@transpiled.com",
    displayName: "Joshua Crass",
    role: "admin",
    status: "active",
    createdAt: admin.database.ServerValue.TIMESTAMP,
  });

  console.log("Admin user created:", userRecord.uid);
}

createAdmin().catch(console.error);

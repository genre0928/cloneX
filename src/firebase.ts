import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAuth } from "firebase/auth/cordova";

const firebaseConfig = {
  apiKey: "AIzaSyCe7CBF19eNOPTIy3UFmR02kACu1OPcPFQ",
  authDomain: "clonex-fb566.firebaseapp.com",
  projectId: "clonex-fb566",
  storageBucket: "clonex-fb566.firebasestorage.app",
  messagingSenderId: "482189092215",
  appId: "1:482189092215:web:91e937b2428cf2f5006d72",
};

const app = initializeApp(firebaseConfig);

// 인증을 위한 추가 코드
// export const auth = getAuth(app)
export const auth = getAuth(app)
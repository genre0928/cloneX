import styled from "styled-components";
import { auth } from "../firebase";
import { GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const Button = styled.span`
  margin-top: 50px;
  background-color: white;
  font-weight: 600;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log('Firebase Error : ', e.message);
      } else {
        console.log('Etc Error : ', e);
      }
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github.svg" />
      깃허브로 로그인하기
    </Button>
  );
}

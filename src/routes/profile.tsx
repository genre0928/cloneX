import styled from "styled-components";
import { auth, storage } from "../firebase";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvartarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvartarImg = styled.img``;
const AvartarInput = styled.input`
  display: none;
`;
const Name = styled.span``;

export default function Profile() {
  const user = auth.currentUser;
  const [avartar, setAvartar] = useState(user?.photoURL);

  const onAvartarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avartars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avartarUrl = await getDownloadURL(result.ref);
      setAvartar(avartarUrl);
      await updateProfile(user, {
        photoURL: avartarUrl,
      });
    }
  };
  return (
    <Wrapper>
      <AvartarUpload htmlFor="avartar">
        {avartar ? (
          <AvartarImg src={avartar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        )}
      </AvartarUpload>
      <AvartarInput
        onChange={onAvartarChange}
        id="avartar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>
    </Wrapper>
  );
}

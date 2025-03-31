import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { toast } from "react-toastify";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 1rem;
    margin-right: 5px;
  }
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
const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditName = styled.textarea`
  width: 100px;
  height: 30px;
  font-size: 1rem;
  color: white;
  background: none;
  border: 1px solid white;
  border-radius: 5pt;
  resize: none;
`;

const SaveButton = styled.button`
  background-color: blue;
  color: white;
  margin: 0px 10px 0 0;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
const CancelButton = styled.button`
  background-color: red;
  color: white;
  margin: 0px 10px 0 0;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avartar, setAvartar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [nickName, setNickName] = useState(user?.displayName ?? "Anonymous");
  const [editNickName, setEditNickName] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);

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
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweet"),
      where("userId", "==", user?.uid),
      orderBy("createAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return { tweet, createAt, userId, username, photo, id: doc.id };
    });
    setTweets(tweets);
  };

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    console.log("클릭");
    setEdit(true);
  };

  const EditNickName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditNickName(e.target.value);
  };

  const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 닉네임 저장
    e.preventDefault();
    // (+) 여기에 나중에 사진을 조건부로 비교하는 부분 추가해주기
    if (user?.displayName === editNickName || editNickName === "") {
      toast("닉네임이 동일합니다.", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    if (!user || isLoading) return;
    try {
      setLoading(true);
      await updateProfile(user, {
        displayName: editNickName,
      });
      await console.log(user);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setEdit(false);
    }
  };

  const onCancel = () => {
    setEdit(false);
  };

  useEffect(() => {
    fetchTweets();
  }, []);
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
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
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
      <NameWrapper>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
          onClick={onClick}
          style={{ display: isEdit ? "none" : "block" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        {isEdit ? (
          <EditName
            value={editNickName || editNickName == "" ? editNickName : nickName}
            onChange={EditNickName}
          ></EditName>
        ) : (
          <Name>{user?.displayName ?? "Anonymous"}</Name>
        )}
        {isEdit ? (
          <>
            <SaveButton onClick={onSave}>Save</SaveButton>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
          </>
        ) : (
          ""
        )}
      </NameWrapper>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}

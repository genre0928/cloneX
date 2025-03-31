import styled from "styled-components";
import { ITweet } from "./timeline";
import { getRelativeTime } from "./getrelativetime";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const Username = styled.span`
  font-weight: 600px;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Time = styled.p`
  font-weight: 600px;
  margin-top: 30px;
  margin-bottom: 15px;
`;

// edit 시 css
const EditPayload = styled.textarea`
  margin: 10px 10px;
  width: 100%;
  color: white;
  resize: none;
  background: none;
  border-radius: 5px;
  border: 1px solid white;
  &:active {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const EditButton = styled.button`
  background-color: lightblue;
  color: black;
  margin: 0px 10px 0 0;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
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

const EditFileButton = styled.label``;
const EditFileInput = styled.input`
  display: none;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({
  username,
  photo,
  tweet,
  createAt,
  userId,
  id,
}: ITweet) {
  const diffTime = getRelativeTime(createAt);
  const user = auth.currentUser;
  const [isEdit, setEdit] = useState(false);
  const [isEditTweet, setIsEditTweet] = useState("");
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<Number | null>(null);
  const [localTweet, setLocalTweet] = useState(tweet);

  useEffect(() => {
    setLocalTweet(isEditTweet);
  }, [tweet]);

  // edit 버튼 -> textarea 변경 후 수정값은 tweet 저장
  const onEditTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsEditTweet(e.target.value);
  };

  // 사진 수정 추가
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const selectedFile = files[0].size;
      if (selectedFile > 1048576) {
        if (inputRef.current) {
          inputRef.current.value = "";
          setFileSize(null);
        }
        alert("이미지는 1MB 이하만 첨부할 수 있습니다.");
        return;
      }
      setFile(files[0]);
      setFileSize(selectedFile);
    }
  };
  // edit 모드 설정 + 취소를 대비하여 기존 tweet 내용 isEditTweet 저장
  const onEdit = () => {
    setEdit(true);
  };
  const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 저장 + 서버에 업데이트하는 코드 구현 필요함
    e.preventDefault();
    // (+) 여기에 나중에 사진을 조건부로 비교하는 부분 추가해주기
    if (tweet === isEditTweet || isEditTweet === "") {
      console.log("트윗 내용이 동일합니다.");
      return;
    }
    if (!user || isLoading || isEditTweet == "" || isEditTweet.length > 180)
      return;
    try {
      setLoading(true);
      const tweetRef = doc(db, "tweet", id);
      await updateDoc(tweetRef, {
        tweet: isEditTweet,
        createAt: Date.now(),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setEdit(false);
      setLocalTweet(isEditTweet);
    }
  };

  const onCancel = () => {
    setEdit(false);
  };
  const onDelete = async () => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweet", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}-${username}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEdit ? (
          <EditPayload
            value={isEditTweet ? isEditTweet : tweet}
            onChange={onEditTweet}
          ></EditPayload>
        ) : (
          <Payload>{localTweet}</Payload>
        )}
        <Time>{diffTime}</Time>
        {user?.uid === userId && !isEdit ? (
          <EditButton onClick={onEdit}>Edit</EditButton>
        ) : null}
        {user?.uid === userId && !isEdit ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
        {user?.uid === userId && isEdit ? (
          <SaveButton onClick={onSave} type="submit">
            Save
          </SaveButton>
        ) : null}
        {user?.uid === userId && isEdit ? (
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}

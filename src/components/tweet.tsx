import styled from "styled-components";
import { ITweet } from "./timeline";
import { getRelativeTime } from "./getrelativetime";

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
  margin-top: 50px;
`;

export default function Tweet({ username, photo, tweet, createAt }: ITweet) {
    const diffTime = getRelativeTime(createAt)

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        <Time>{diffTime}</Time>
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}

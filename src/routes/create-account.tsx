import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth/cordova";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-conponent";
import GithubButton from "../components/gibhub-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      // create an account
      // set the name of the user
      //  redirect to the home page
      setLoading(true);
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credential.user);
      await updateProfile(credential.user, {
        displayName: name,
      });
      navigate("/");
    } catch (e) {
      // setError
      if (e instanceof FirebaseError) {
        setError(e.message);
        console.log(error);
      }
    } finally {
      setLoading(false);
    }

    //
    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join 💙</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          onChange={onChange}
          required
        />
        <Input
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          onChange={onChange}
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          onChange={onChange}
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        이미 계정이 있으신가요? <Link to="/login">Log in</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}

"use client";
import "../css/main.css";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface ApiData {
  id: string;
  avatar: string;
  name: string;
  createdAt: string;
}

export async function fetchData(): Promise<ApiData> {
  try {
    const response = await axios.get(
      "https://64652a269c09d77a62e5cb10.mockapi.io/users/1"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable To Load Data From Api");
  }
}

export default function Home() {
  var FakeData: ApiData = {
    id: "32",
    name: "",
    avatar: "fd",
    createdAt: "ff",
  };

  const [User, SetUser] = useState("");
  const [Pin, SetPin] = useState("");
  const [Message, SetMessage] = useState("Welcome");
  const [Disabled, SetDisabled] = useState(true);
  const [data, setData] = useState<ApiData>(FakeData);

  useEffect(() => {
    fetchData()
      .then((responseData) => setData(responseData))
      .catch((error) => SetMessage("Unable To Load Data From Api"));
  }, []);

  return (
    <div className="main">
      <div className="main__login">
        <div className="main__login_input_message">{Message}</div>
        <div className="main__login_input">
          <input
            onChange={(e) => {
              SetUser(e.target.value);
              if (User == "" || Pin == "") {
                SetDisabled(true);
              } else {
                SetDisabled(false);
              }
            }}
            placeholder="user"
          ></input>
          <input
            onChange={(e) => {
              SetPin(e.target.value);
              if (User == "" || Pin == "") {
                SetDisabled(true);
              } else {
                SetDisabled(false);
              }
              if (e.target.value.length < 8) {
                SetMessage("Length of password should be minimum 8");
                SetDisabled(true);
              } else {
                SetMessage("Password meets requirment");
                SetDisabled(false);
              }
            }}
            placeholder="pin"
          ></input>
          <input
            className="main__login_input_button"
            disabled={Disabled}
            type={"submit"}
            onClick={() => {
              login();
            }}
            value={"Login"}
          ></input>
        </div>
        <div className="main__users">
          Suggested UserName (api data):<br></br>
          <div>{data.name}</div>
        </div>
      </div>
    </div>
  );

  function login() {
    if (User == "" && Pin == "") {
      SetMessage("Please complete the field");
      return;
    }

    if (User == "99" && Pin == "99999999") {
      SetMessage("Password valid");
    } else {
      SetMessage("Password Is Invalid");
    }
  }
}

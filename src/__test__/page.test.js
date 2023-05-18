import React from "react";
import axios from "axios";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Home, { fetchData } from "../app/page";

describe("LoginScreen", () => {
  it("renders the form", () => {
    const { getByPlaceholderText, getByRole } = render(<Home />);

    expect(getByPlaceholderText("user")).toBeInTheDocument();
    expect(getByPlaceholderText("pin")).toBeInTheDocument();
    expect(getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("submits the form with the cotrrect credentials", async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<Home />);
    const usernameInput = getByPlaceholderText("user");
    const passwordInput = getByPlaceholderText("pin");
    const loginButton = getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "99" } });
    fireEvent.change(passwordInput, { target: { value: "99999999" } });
    fireEvent.click(loginButton);

    const successMessage = getByText("Password valid");
    expect(successMessage).toBeInTheDocument();
  });

  it("submits the form with the invalid credentials", async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<Home />);
    const usernameInput = getByPlaceholderText("user");
    const passwordInput = getByPlaceholderText("pin");
    const loginButton = getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "99989" } });
    fireEvent.change(passwordInput, { target: { value: "9932080808089" } });
    fireEvent.click(loginButton);

    const successMessage = getByText("Password Is Invalid");
    expect(successMessage).toBeInTheDocument();
  });

  it("check button is disabled or not if no data entered", () => {
    const { getByRole, getByPlaceholderText } = render(<Home />);

    const usernameInput = getByPlaceholderText("user");
    const passwordInput = getByPlaceholderText("pin");
    const loginButton = getByRole("button", { name: "Login" });

    expect(loginButton).toBeDisabled();

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(loginButton).toBeDisabled();

    fireEvent.change(passwordInput, { target: { value: "password" } });
    expect(loginButton).not.toBeDisabled();
  });

  it("check password has minimum count ", () => {
    const { getByPlaceholderText, getByText } = render(<Home />);

    const usernameInput = getByPlaceholderText("user");
    const passwordInput = getByPlaceholderText("pin");

    fireEvent.change(usernameInput, { target: { value: "99989" } });
    fireEvent.change(passwordInput, { target: { value: "99320909890" } });

    const successMessage = getByText("Password meets requirment");
    expect(successMessage).toBeInTheDocument();
  });

  it("check password doesnot have minimum count ", () => {
    const { getByPlaceholderText, getByText } = render(<Home />);

    const usernameInput = getByPlaceholderText("user");
    const passwordInput = getByPlaceholderText("pin");

    fireEvent.change(usernameInput, { target: { value: "99989" } });
    fireEvent.change(passwordInput, { target: { value: "9" } });

    const successMessage = getByText("Length of password should be minimum 8");
    expect(successMessage).toBeInTheDocument();
  });

  jest.mock("axios");
  it("renders data from API", async () => {
    axios.get = jest.fn();
    const mockedResponse = {
      data: { id: "32", name: "name1", avatar: "fd", createdAt: "ff" },
    };

    axios.get.mockResolvedValue(mockedResponse);
    const name = await fetchData();
    expect(name.name).toEqual("name1");
  });

  it("handles API error", async () => {
    const errorMessage = "Unable To Load Data From Api";
    axios.get.mockRejectedValue(new Error(errorMessage));

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText(errorMessage)).toBeInTheDocument();
    });
  });
});

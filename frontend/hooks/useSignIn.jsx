import API_URL from "@/components/Config";
import axios from "axios";
import { useState } from "react";
import useAuthContext from "./useAuthContext";

const useSignIn = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signIn = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const url = `${API_URL}/users/sign-in `;

    axios
      .post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            username: username,
            password: password,
          },
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
      });
  };

  return { signIn, isLoading, error };
};

export { useSignIn };

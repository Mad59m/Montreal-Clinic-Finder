import axios from "axios";
import { useState } from "react";
import { ToastProvider, useToasts } from "react-toast-notifications";

axios.defaults.baseURL = "http://localhost:8080";

const LoginPage = () => {
  const { addToast } = useToasts();
  const [formValue, setFormValue] = useState({ username: "", password: "" });
  // const [loading, setLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/auth/signin", formValue)
      .then((res) => {
        addToast("you have successfully logged in", {
          appearance: "success",
          autoDismiss: true,
        });
        localStorage.setItem("userData", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err.response);
        addToast(err.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  const changeHandler = ({ target }) => {
    setFormValue({ ...formValue, [target.name]: target.value });
  };
  return (
    <section>
      <div className="w-full max-w-xs mx-auto mt-8">
        <form
          className="bg-white shadowmd rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={submitHandler}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:border-2 focus:border-purple-500"
              id="username"
              type="username"
              name="username"
              placeholder="username"
              onChange={changeHandler}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-2 focus:border-purple-500"
              id="password"
              type="password"
              placeholder="******************"
              onChange={changeHandler}
              name="password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-purple-500 hover:bg-purpule-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2021 Majid Co. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default LoginPage;

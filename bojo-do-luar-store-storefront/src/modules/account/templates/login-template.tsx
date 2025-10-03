"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import ResetPassword from "@modules/account/components/reset-password"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} />
      ) : currentView === "register" ? (
        <Register setCurrentView={setCurrentView} />
      ) : (
        <ResetPassword setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate

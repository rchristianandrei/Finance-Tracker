import { GoogleLogin } from "@react-oauth/google"

export default function GoogleSignIn() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse)
      }}
      onError={() => {
        console.log("Login Failed")
      }}
      theme="outline"
      size="large"
      shape="pill"
      text="continue_with"
    />
  )
}

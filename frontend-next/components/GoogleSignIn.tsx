import { CredentialResponse, GoogleLogin } from "@react-oauth/google"

export default function GoogleSignIn({
  onSuccess,
}: {
  onSuccess: (credentialResponse: CredentialResponse) => void
}) {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        onSuccess(credentialResponse)
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

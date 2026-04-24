import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container-x py-16 flex justify-center">
      <SignIn
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/portal"
      />
    </div>
  );
}

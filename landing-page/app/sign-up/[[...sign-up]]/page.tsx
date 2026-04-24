import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="container-x py-16 flex justify-center">
      <SignUp
        signInUrl="/sign-in"
        fallbackRedirectUrl="/portal"
      />
    </div>
  );
}

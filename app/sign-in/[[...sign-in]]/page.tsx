import { SignIn } from '@clerk/nextjs';
export default function Page(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn 
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/"
        afterSignInUrl="/"
      />
    </div>
  )
}

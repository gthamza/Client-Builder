// src/pages/Auth/SignIn.tsx
import { SignIn } from "@clerk/clerk-react";

export default function CustomSignIn() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      redirectUrl="/dashboard"
      appearance={{
        elements: {
          rootBox: "min-h-screen flex items-center justify-center bg-white",
          card: "rounded-xl shadow-md border border-gray-200 p-6 bg-white",
          logoBox:
            "w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto",
          logoImage: "hidden",
          headerTitle: "text-3xl font-bold text-gray-900 text-center",
          headerSubtitle: "text-gray-600 text-center",
          formFieldLabel: "text-sm font-medium text-gray-700",
          formFieldInput:
            "pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400",
          formButtonPrimary:
            "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium",
          socialButtonsBlockButton:
            "w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm text-gray-500 hover:bg-gray-50",
          footerActionText: "text-sm text-gray-600 text-center",
          footerActionLink: "text-blue-600 hover:text-blue-500 font-medium",
        },
        variables: {
          colorPrimary: "#2563eb",
          borderRadius: "0.75rem",
        },
      }}
    />
  );
}

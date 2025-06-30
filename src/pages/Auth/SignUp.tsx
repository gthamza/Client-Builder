import { SignUp } from "@clerk/clerk-react";

const CustomSignUp = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* CP Logo Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">CP</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-gray-600">Join the Client Portal platform</p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <SignUp
            routing="path"
            path="/sign-up"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                card: "shadow-none bg-white p-0", // remove internal padding
                formButtonPrimary:
                  "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium",
                formFieldInput:
                  "block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400",
                formFieldLabel: "block text-sm font-medium text-gray-700 mb-1",
                headerTitle: "text-xl font-semibold text-gray-900",
                headerSubtitle: "text-sm text-gray-600",
              },
              variables: {
                colorPrimary: "#2563eb", // Tailwind blue-600
                colorText: "#1f2937", // Tailwind gray-800
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomSignUp;

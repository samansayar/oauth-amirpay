"use client";

import React, { startTransition, useEffect, useTransition } from "react";
import { RequestTokenSaveToCookies, SigninWithAmirpayAction } from "./signin";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

type SearchParams = {
  code: string;
  state: string;
  error: string;
  error_description: string;
};

export default function SigninForm({
  searchParams: { code, state, ...rest },
}: {
  searchParams: SearchParams;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function checkAccessToken() {
    return await RequestTokenSaveToCookies(code, state);
  }

  useEffect(() => {
    if (code && state) {
      checkAccessToken()
        .then((accessToken) => {
          console.log(accessToken);
          toast.success("شما با موفقیت وارد شدید");
          return router.push("/dashboard");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message);
        });
    }
  }, [code, state]);


  const handleAmirpaySignin = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await SigninWithAmirpayAction(
        { message: "" },
        new FormData()
      );

      if (result.authUrl) {
        window.open(result.authUrl, "_blank", "noopener=1,noreferrer=1");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to your account
          </h2>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        <form onSubmit={handleAmirpaySignin} className="space-y-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl
                     hover:from-green-600 hover:to-emerald-700 transform transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     flex items-center justify-center gap-3 font-medium text-lg"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </div>
            ) : (
              "Sign in with AmirPay"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <a href="#" className="text-green-600 hover:text-green-700 mx-1">
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

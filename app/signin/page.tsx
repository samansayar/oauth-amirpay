import { cookies } from "next/headers";
import SigninForm from "./form";
import ErrorHandler from "./co/error-handler";
import { RequestTokenSaveToCookies } from "./signin";
import { redirect } from "next/navigation";

type SearchParams = {
  code: string;
  state: string;
  error: string;
  error_description: string;
};

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const code = sp.code;
  const state = sp.state;
  const error = sp.error;
  const error_description = sp.error_description;

  
  if (error && error_description) {
    console.log(error, error_description);
    return <ErrorHandler error={error} error_description={error_description} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SigninForm searchParams={{ code, state, error, error_description }} />
    </div>
  );
}

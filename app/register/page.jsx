import { redirect } from "next/navigation";
import RegForm from "./RegForm";
import { cookies, headers } from "next/headers";
import { instituteDetails } from "@/app/utils/institute";

export const metadata = {
	title: "Register",
};

const Page = async ({ searchParams }) => {
	const { instituteCode } = searchParams;

	const institute = await instituteDetails({ instituteCode });

	const { authCookie, authLink } = institute;
	
	const cookieStore = cookies();
	const cookie = cookieStore.get(authCookie);

	const requestHeaders = headers();
	const host = requestHeaders.get('host');
	const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
	const redirect_url = protocol + "://" + host;

	if (!cookie) {
		redirect(authLink + "?redirect_url=" + redirect_url);
	}

	const token = cookie.value;
	if (!token) {
		redirect(authLink + "?redirect_url=" + redirect_url);
	}

	const email = JSON.parse(atob(token.split(".")[1])).email; // get the user email from jwt

	if (!email) {
		redirect(authLink + "?redirect_url=" + redirect_url);
	}

	return <RegForm email={email} instituteCode={instituteCode} />;
};

export default Page;

import { headers } from "next/headers";

type CompanyInfoResponse = {
  success: boolean;
  data?: {
    privacyPolicy?: string | null;
  };
  error?: string;
};

async function getPrivacyPolicy(): Promise<string | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") ?? "http";
    const url = `${proto}://${host}/api/company-info`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch company info:", res.statusText);
      return null;
    }

    const json = (await res.json()) as CompanyInfoResponse;
    if (!json.success || !json.data) {
      return null;
    }

    return json.data.privacyPolicy ?? null;
  } catch (error) {
    console.error("Error fetching company info:", error);
    return null;
  }
}

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await getPrivacyPolicy();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4">
      <div className="max-w-3xl w-full bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold text-white mb-3 text-center">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-300 mb-6 text-center">
          We care deeply about how your data is collected, used, and protected.
          Please read this note carefully to understand our practices.
        </p>

        {privacyPolicy ? (
          <div className="text-sm leading-relaxed text-slate-100 whitespace-pre-line">
            {privacyPolicy}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center">
            Privacy policy content is not available at the moment. Please check
            back later.
          </p>
        )}
      </div>
    </div>
  );
}


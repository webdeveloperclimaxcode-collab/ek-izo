import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}/api`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Hello from ek website
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        The base URL of API&apos;s: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{baseUrl}</code>
      </p>
    </div>
  );
}

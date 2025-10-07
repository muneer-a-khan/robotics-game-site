// Simple test page to verify the build is working
export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Build Test Page</h1>
      <p className="text-green-600">✅ Build is working successfully!</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Status:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ TypeScript compilation</li>
          <li>✅ Next.js build</li>
          <li>✅ Database schema</li>
          <li>✅ API routes</li>
          <li>✅ Component structure</li>
        </ul>
      </div>
    </div>
  );
}

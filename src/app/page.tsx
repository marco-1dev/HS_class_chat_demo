import { Chatbot } from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-cyan-100 flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-6xl font-bold text-center bg-gradient-to-r from-red-600 to-cyan-600 bg-clip-text text-transparent">
          Ababio 
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <Chatbot/>
        </div>
      </div>
    </main>
  );
}

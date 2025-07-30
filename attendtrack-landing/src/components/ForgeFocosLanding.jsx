// App.jsx
import React, { useState } from "react";
import { CheckCircle, Flame, Github, Mail, Target, Coffee } from "lucide-react";

const pricingOptions = [4, 8, 12, 16, 0];

export default function App() {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [email, setEmail] = useState("");

  return (
    <div className="font-sans text-white bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-br from-purple-800 to-indigo-900">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">ForgeFocus</h1>
        <p className="text-xl text-gray-300 mb-6">
          Stay focused. Build more. Track everything. <br />Built for Software Developers.
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow">
          🚀 Join the Beta
        </button>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">Why Developers Love It</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Track coding time, DSA progress, job hunt", 
            "Block distractions like YouTube, Twitter, Insta",
            "Visualize recruiter calls, OAs, and LinkedIn DMs"
          ].map((point, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 shadow">
              <CheckCircle className="text-green-400 mb-2" />
              <p>{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-800">
        <h2 className="text-3xl font-semibold mb-6 text-center">Features Built for Developers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: <Target />, text: "Quantify DSA, Interviews, Jobs, Recruiters" },
            { icon: <Flame />, text: "Track coding time + tutorial minutes" },
            { icon: <CheckCircle />, text: "Pomodoro & Distraction Blocker" },
            { icon: <Github />, text: "GitHub Sync for commit activity (Pro)" },
            { icon: <Mail />, text: "Cold DM tracker + Resume Export" },
          ].map((f, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-xl shadow text-center">
              <div className="mb-4 mx-auto w-fit text-yellow-400">{f.icon}</div>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Comparison Cards */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">Compare Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Free Plan</h3>
            <ul className="space-y-2 text-gray-300">
              <li>✅ Time tracking</li>
              <li>✅ Task history</li>
              <li>🔸 Limited focus mode</li>
              <li>🔸 Manual Quantify tab</li>
              <li>❌ GitHub sync</li>
              <li>❌ Resume export</li>
              <li>❌ Pomodoro</li>
              <li>❌ Weekly summary</li>
            </ul>
          </div>
          <div className="bg-yellow-400 text-black p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-4">Premium Plan – $4/month</h3>
            <ul className="space-y-2">
              <li>✅ All Free Plan features</li>
              <li>✅ Full focus mode</li>
              <li>✅ Visual + reminder Quantify tab</li>
              <li>✅ GitHub sync</li>
              <li>✅ Resume export</li>
              <li>✅ Pomodoro</li>
              <li>✅ Weekly AI summary</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">What Developers Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <p className="mb-2 italic">“Finally, a tool that tracks DSA + job hunt in one place. I use it every day.”</p>
            <p className="text-yellow-400">— Ravi, Backend Developer</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <p className="mb-2 italic">“ForgeFocus helped me realize I wasn’t applying enough. Now I track recruiter calls too.”</p>
            <p className="text-yellow-400">— Aditi, Full Stack Dev</p>
          </div>
        </div>
      </section>

      {/* Pricing Test Section */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Help us price it right 🎯</h2>
        <p className="text-center mb-6 text-gray-400">What would you be willing to pay monthly for ForgeFocus Pro?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {pricingOptions.map((price) => (
            <button
              key={price}
              onClick={() => setSelectedPrice(price)}
              className={`rounded-lg px-4 py-2 font-semibold border ${
                selectedPrice === price
                  ? "bg-yellow-400 text-black"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {price === 0 ? "Just want free version" : `$${price}/month`}
            </button>
          ))}
        </div>
        <div className="text-center">
          <input
            type="email"
            placeholder="Optional Email for Beta Access"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 w-full max-w-md text-black rounded-md"
          />
          <button
            className="bg-yellow-400 text-black mt-4 px-6 py-2 rounded-md font-semibold shadow"
            onClick={() => alert(`Thanks! You selected $${selectedPrice}. Email: ${email}`)}
          >
            Submit Response
          </button>
        </div>
      </section>

      {/* Buy Me a Coffee */}
      <section className="py-10 text-center">
        <a
          href="https://www.buymeacoffee.com/yourlink"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold shadow hover:bg-yellow-300"
        >
          <Coffee className="w-5 h-5" /> Buy me a coffee
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        Made for devs by devs ❤️ | © {new Date().getFullYear()} ForgeFocus
      </footer>
    </div>
  );
}

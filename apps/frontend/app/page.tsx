"use client"
import React from 'react';
import { Globe, Shield, Users, ArrowRight } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
function Home() {
  const router = useRouter();
  return (
    <div>  
      <div className="mt-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Decentralized Website Monitoring for the Web3 Era
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          &ldquo;Monitor your website&apos;s uptime with a decentralized network of validators. 
          No single point of failure. Real-time alerts. Complete transparency.&rdquo;
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition flex items-center">
                Start Monitoring
                <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition flex items-center"
          onClick={() => {
            router.push("/dashboard");
          }}
          >   Start Monitoring
              <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </SignedIn> 
          
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 mt-30 bg-slate-800" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose DecentraWatch?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-700 p-6 rounded-xl">
              <Globe className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Global Network</h3>
              <p className="text-slate-300">
                Distributed monitoring nodes across the globe ensure accurate uptime data from multiple locations.
              </p>
            </div>
            <div className="bg-slate-700 p-6 rounded-xl">
              <Shield className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Decentralized Security</h3>
              <p className="text-slate-300">
                No central point of failure. Your monitoring data is distributed across the network.
              </p>
            </div>
            <div className="bg-slate-700 p-6 rounded-xl">
              <Users className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Community Powered</h3>
              <p className="text-slate-300">
                Join a network of validators and earn rewards for contributing to the monitoring network.
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>

  );
}

export default Home;
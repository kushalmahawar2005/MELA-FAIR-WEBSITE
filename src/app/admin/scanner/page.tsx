"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { isAdminEmail } from "@/lib/admin";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, QrCode } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

type ScanResult = {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    userName: string;
    tickets: any[];
  };
};

export default function ScannerPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Protect route
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && (!user || !isAdminEmail(user.email))) {
      router.push("/login?next=/admin/scanner");
    }
  }, [hasHydrated, user, router]);

  // Initialize Scanner
  useEffect(() => {
    if (!hasHydrated || !user || !isAdminEmail(user.email)) return;
    
    // Cleanup any existing scanner to prevent duplicates in strict mode
    const existingScanner = document.getElementById("qr-reader");
    if (existingScanner) existingScanner.innerHTML = "";

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const onScanSuccess = async (decodedText: string) => {
      // Pause scanning while we verify
      scanner.pause(true);
      setIsScanning(false);

      try {
        const res = await fetch("/api/admin/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: decodedText }),
        });
        
        const data = await res.json();
        setScanResult(data);
      } catch (err) {
        setScanResult({
          success: false,
          message: "Network error occurred while verifying.",
        });
      }
    };

    const onScanFailure = (error: any) => {
      // ignore failures, they happen constantly when no QR is in view
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [hasHydrated, user]);

  if (!hasHydrated || !user || !isAdminEmail(user.email)) return null;

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
    // Reload the page to reset the scanner completely (simplest robust way for html5-qrcode)
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0e0620] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-deep-purple/80 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <Link href="/admin" className="text-white/60 hover:text-white transition">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="font-display text-xl">Ticket Scanner</h1>
          <p className="text-xs text-white/50 uppercase tracking-widest">Admin Access</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        
        {/* Viewfinder (Hidden when there's a result) */}
        <div className={`w-full max-w-md ${scanResult ? 'hidden' : 'block'}`}>
          <div className="mb-6 text-center">
            <QrCode className="h-10 w-10 text-accent-yellow mx-auto mb-3 opacity-80" />
            <h2 className="font-display text-2xl">Scan Ticket</h2>
            <p className="text-white/60 text-sm mt-1">Point your camera at the customer's QR code</p>
          </div>
          
          <div className="overflow-hidden rounded-2xl border-2 border-white/10 bg-black/50 shadow-2xl relative">
            <div id="qr-reader" className="w-full"></div>
            {/* Overlay scanning animation */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent-yellow/20 to-transparent h-1/2 animate-[scan_2s_ease-in-out_infinite] opacity-50" />
          </div>
        </div>

        {/* Scan Result */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl"
            >
              {scanResult.success ? (
                <>
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 border-2 border-green-500/40">
                    <CheckCircle2 className="h-14 w-14 text-green-400" />
                  </div>
                  <h2 className="font-display text-3xl text-green-400 mb-2">VALID TICKET</h2>
                  <p className="text-white/80 font-medium text-lg">{scanResult.booking?.userName}</p>
                  <p className="text-white/50 text-sm mb-6 uppercase tracking-wider">{scanResult.booking?.id}</p>
                  
                  <div className="bg-black/30 rounded-xl p-4 text-left border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Ticket Details</p>
                    {scanResult.booking?.tickets.map((t, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                        <span className="font-display tracking-wide">{t.rideSlug.replace(/-/g, ' ')}</span>
                        <span className="bg-accent-yellow text-deep-purple px-2 py-0.5 rounded text-xs font-bold">x{t.quantity}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500/40">
                    <XCircle className="h-14 w-14 text-red-400" />
                  </div>
                  <h2 className="font-display text-3xl text-red-400 mb-2">INVALID</h2>
                  <p className="text-white/70 text-base leading-relaxed max-w-[250px] mx-auto">{scanResult.message}</p>
                </>
              )}

              <button
                onClick={resetScanner}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-accent-yellow hover:bg-accent-yellow/90 text-deep-purple font-display text-sm px-6 py-4 transition uppercase tracking-wider shadow-lg"
              >
                <RefreshCw className="h-4 w-4" /> Scan Next Ticket
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      
      {/* Custom CSS for html5-qrcode overrides and animations */}
      <style dangerouslySetInnerHTML={{__html: `
        #qr-reader { border: none !important; }
        #qr-reader__dashboard_section_csr span { color: white !important; font-family: var(--font-body) !important; }
        #qr-reader__dashboard_section_swaplink { color: #EEA727 !important; text-decoration: none; margin-top: 10px; display: inline-block; }
        #qr-reader__dashboard_section_csr button { background: #210C6D; border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 8px 16px; margin: 10px 5px; cursor: pointer; font-family: var(--font-body); }
        #qr-reader__camera_selection { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 8px; margin-bottom: 10px; width: 100%; outline: none; }
        #qr-reader__camera_selection option { background: #0e0620; }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}} />
    </div>
  );
}

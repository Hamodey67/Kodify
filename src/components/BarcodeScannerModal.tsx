import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertTriangle, RefreshCw } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  language: string;
  t: any;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  language,
  t,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const elementId = "barcode-scanner-video-container";

  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg(null);
    setIsCameraReady(false);
    isScanningRef.current = false;

    // Delay start slightly to guarantee the DOM node is rendered
    const startTimeout = setTimeout(() => {
      const initScanner = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(t.cameraScannerNoSupport || 'Browser does not support camera access.');
          }

          const html5Qrcode = new Html5Qrcode(elementId);
          scannerRef.current = html5Qrcode;

          await html5Qrcode.start(
            { facingMode: 'environment' },
            {
              fps: 15,
              // Setup qrbox size based on container dimensions
              qrbox: (width, height) => {
                const minEdge = Math.min(width, height);
                const qrboxSize = Math.floor(minEdge * 0.7);
                // Rectangular box is ideal for 1D barcodes
                return {
                  width: qrboxSize,
                  height: Math.floor(qrboxSize * 0.5),
                };
              },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              // Play a quick high-pitched success beep
              try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.type = 'sine';
                oscillator.frequency.value = 1200;
                gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.08);
              } catch (e) {
                console.warn('Web Audio beep failed:', e);
              }

              // Fire the success handler
              onScanSuccess(decodedText);
            },
            () => {
              // Ignore failure callbacks as they trigger constantly when searching
            }
          );

          isScanningRef.current = true;
          setIsCameraReady(true);
        } catch (err: any) {
          console.error('[Scanner Init Error]:', err);
          let userFriendlyError = t.cameraScannerError || 'Failed to start camera. Please check camera permissions.';
          
          if (err.message) {
            // Include camera error detail to help users diagnose
            userFriendlyError += ` (${err.message})`;
          }
          setErrorMsg(userFriendlyError);
        }
      };

      initScanner();
    }, 150);

    return () => {
      clearTimeout(startTimeout);
      const cleanUpScanner = async () => {
        if (scannerRef.current && isScanningRef.current) {
          try {
            isScanningRef.current = false;
            await scannerRef.current.stop();
          } catch (e) {
            console.error('Failed to stop html5-qrcode scanner cleanly:', e);
          }
        }
      };
      cleanUpScanner();
    };
  }, [isOpen, t, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 glass z-[200] flex items-center justify-center p-4">
      <div className="bg-[#fbfcfe] border border-[#e3e9f1] rounded-2xl w-full max-w-sm overflow-hidden relative shadow-[0_24px_60px_rgba(15,23,42,0.12)] flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e3e9f1] flex justify-between items-center bg-[#f4f7fb]">
          <h4 className="font-extrabold text-sm text-[#18212f] flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Camera size={16} />
            </span>
            <span>{t.cameraScannerTitle || 'Scan Barcode'}</span>
          </h4>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#18212f] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[320px] bg-[#fbfcfe]">
          {errorMsg ? (
            <div className="text-center p-4 flex flex-col items-center gap-4">
              <AlertTriangle className="text-[#dc2626] w-12 h-12 animate-bounce" />
              <p className="text-[#334155] text-xs font-semibold leading-relaxed max-w-xs">{errorMsg}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#fbfcfe] hover:bg-[#eff6ff] text-[#64748b] hover:text-[#2563eb] rounded-xl text-xs font-bold transition-all active:translate-y-px border border-[#e3e9f1] hover:border-[#bfdbfe]"
              >
                {t.close || 'Close'}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* Video rendering container */}
              <div 
                id={elementId} 
                className="w-full aspect-square max-w-[260px] bg-[#18212f] rounded-2xl overflow-hidden border border-[#e3e9f1] relative shadow-inner"
              >
                {/* Loader when camera is launching */}
                {!isCameraReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300 bg-[#18212f]/95 z-20">
                    <RefreshCw className="animate-spin text-blue-400 w-7 h-7" />
                    <span className="text-xs font-medium">{t.loading || 'Initializing Camera...'}</span>
                  </div>
                )}

                {/* Viewfinder overlay shown only when camera is fully active */}
                {isCameraReady && (
                  <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                    {/* Viewfinder Box Outline */}
                    <div className="w-[182px] h-[91px] border-2 border-blue-400/80 rounded-xl relative bg-transparent shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]">
                      {/* Corners */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-300 rounded-tl-md" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-300 rounded-tr-md" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-300 rounded-bl-md" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-300 rounded-br-md" />
                      
                      {/* Scanning laser effect */}
                      <div className="w-full h-0.5 bg-rose-500 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              {/* Guide message */}
              <p className="text-xs text-[#64748b] mt-5 text-center max-w-xs leading-relaxed">
                {t.cameraScannerDesc || 'Align the barcode inside the frame to scan.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

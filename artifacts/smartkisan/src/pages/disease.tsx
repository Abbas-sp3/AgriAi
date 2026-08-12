import { useRef, useState, useCallback, useEffect } from "react";
import {
  Microscope, Camera, Upload, CheckCircle2, AlertTriangle,
  Loader2, RefreshCw, Leaf, Zap, TrendingDown, ShieldCheck,
  Stethoscope, X, ZoomIn,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

interface DiseaseInfo {
  name: string;
  confidence: string;
  severity: string;
  symptoms: string;
  cause: string;
  treatment: string[];
  prevention: string[];
}

interface DetectionResult {
  cropIdentified: string;
  isHealthy: boolean;
  diseases: DiseaseInfo[];
  immediateAction: string;
  estimatedYieldImpact: string;
}

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const MAX_PX = 1024;

function canvasFromVideo(video: HTMLVideoElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")!.drawImage(video, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.88);
}

function resizeDataUrl(dataUrl: string, maxPx = MAX_PX): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.88));
    };
    img.src = dataUrl;
  });
}

function resizeFileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_PX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      const dataUrl = c.toDataURL("image/jpeg", 0.88);
      resolve({ base64: dataUrl.split(",")[1], mimeType: "image/jpeg" });
    };
    img.onerror = reject;
    img.src = url;
  });
}

function SeverityBadge({ severity }: { severity: string }) {
  const s = severity.toLowerCase();
  if (s.includes("severe") || s.includes("high") || s.includes("गंभीर") || s.includes("तीव्र") || s.includes("கடுமை")) {
    return <Badge className="bg-red-100 text-red-700 border-red-200">{severity}</Badge>;
  }
  if (s.includes("moderate") || s.includes("medium") || s.includes("मध्यम") || s.includes("மிதமான")) {
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200">{severity}</Badge>;
  }
  return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">{severity}</Badge>;
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const c = confidence.toLowerCase();
  if (c.includes("high") || c.includes("उच्च") || c.includes("அதிக") || c.includes("ఎక్కువ")) {
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{confidence}</Badge>;
  }
  if (c.includes("medium") || c.includes("moderate") || c.includes("मध्यम")) {
    return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{confidence}</Badge>;
  }
  return <Badge className="bg-gray-100 text-gray-600 border-gray-200">{confidence}</Badge>;
}

export default function Disease() {
  const { t, lang } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const closeCamera = useCallback(() => {
    stopStream();
    setCameraOpen(false);
    setCameraError(null);
    setVideoReady(false);
  }, [stopStream]);

  useEffect(() => {
    if (!cameraOpen) return;
    setVideoReady(false);
    setCameraError(null);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        setCameraError("Camera access denied or not available. Please upload a photo instead.");
        setCameraOpen(false);
      });

    return () => stopStream();
  }, [cameraOpen, stopStream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current) return;
    const raw = canvasFromVideo(videoRef.current);
    const resized = await resizeDataUrl(raw);
    const base64 = resized.split(",")[1];
    setPreviewUrl(resized);
    setImageData({ base64, mimeType: "image/jpeg" });
    setResult(null);
    setError(null);
    closeCamera();
  }, [closeCamera]);

  const handleTakePhoto = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      fileInputRef.current?.click();
      return;
    }
    setCameraOpen(true);
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setResult(null);
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    try {
      const data = await resizeFileToBase64(file);
      setImageData(data);
    } catch {
      setError(t("detect_error"));
    }
  }, [t]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (!imageData) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${BASE_URL}/api/disease/detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageData.base64, mimeType: imageData.mimeType, lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DetectionResult = await res.json();
      setResult(data);
    } catch {
      setError(t("detect_error"));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageData(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-white font-medium text-sm">{t("take_photo")}</span>
            <button onClick={closeCamera} className="text-white p-1">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onCanPlay={() => setVideoReady(true)}
              className="w-full h-full object-cover"
            />
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
            )}
            {/* Crop guide overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-72 h-72 border-2 border-white/60 rounded-2xl" />
            </div>
          </div>

          <div className="p-6 flex justify-center">
            <button
              onClick={capturePhoto}
              disabled={!videoReady}
              className="w-16 h-16 rounded-full bg-white disabled:opacity-40 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <ZoomIn className="h-7 w-7 text-gray-800" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-xl">
          <Microscope className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("disease_title")}</h1>
          <p className="text-muted-foreground text-sm">{t("disease_sub")}</p>
        </div>
      </div>

      {/* Camera permission error */}
      {cameraError && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3 flex items-center gap-2 text-amber-700 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {cameraError}
          </CardContent>
        </Card>
      )}

      {/* Upload / Camera Card */}
      <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-emerald-400 transition-colors">
        <CardContent className="p-6">
          {!previewUrl ? (
            <div
              className="flex flex-col items-center justify-center gap-4 cursor-pointer py-6"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-4 bg-emerald-50 rounded-full">
                <Leaf className="h-10 w-10 text-emerald-400" />
              </div>
              <p className="text-center text-muted-foreground text-sm max-w-xs">{t("tap_to_capture")}</p>
              <div className="flex gap-3 flex-wrap justify-center">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={(e) => { e.stopPropagation(); handleTakePhoto(); }}
                >
                  <Camera className="h-4 w-4" />
                  {t("take_photo")}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  <Upload className="h-4 w-4" />
                  {t("upload_photo")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-muted">
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="w-full max-h-72 object-contain"
                />
                <button
                  onClick={reset}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={analyze}
                  disabled={loading || !imageData}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />{t("analyzing_img")}</>
                  ) : (
                    <><Stethoscope className="h-4 w-4" />{t("analyze_btn")}</>
                  )}
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                  <RefreshCw className="h-4 w-4" />
                  {t("change_image")}
                </Button>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3 text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Healthy Result */}
      {result?.isHealthy && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold text-emerald-700">{t("healthy_crop")}</h2>
              {result.cropIdentified && result.cropIdentified !== "Unknown" && (
                <p className="text-sm text-emerald-600 mt-1">
                  {t("crop_identified")}: <span className="font-semibold">{result.cropIdentified}</span>
                </p>
              )}
              <p className="text-sm text-emerald-600 mt-2">{t("no_disease")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disease Results */}
      {result && !result.isHealthy && result.diseases?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-foreground">{t("diseases_found")}</span>
              <Badge variant="destructive">{result.diseases.length}</Badge>
            </div>
            {result.cropIdentified && result.cropIdentified !== "Unknown" && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4 text-emerald-500" />
                {t("crop_identified")}: <span className="font-medium text-foreground ml-1">{result.cropIdentified}</span>
              </div>
            )}
          </div>

          {result.immediateAction && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex gap-3">
                <Zap className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">{t("immediate_action")}</p>
                  <p className="text-sm text-red-600 mt-0.5">{result.immediateAction}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result.estimatedYieldImpact && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex gap-3">
                <TrendingDown className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-700">{t("yield_impact")}</p>
                  <p className="text-sm text-orange-600 mt-0.5">{result.estimatedYieldImpact}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result.diseases.map((disease, idx) => (
            <Card key={idx} className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-start justify-between gap-2 flex-wrap">
                  <span>{disease.name}</span>
                  <div className="flex gap-2 flex-wrap">
                    <SeverityBadge severity={`${t("severity_label")}: ${disease.severity}`} />
                    <ConfidenceBadge confidence={disease.confidence} />
                  </div>
                </CardTitle>
                {disease.cause && (
                  <p className="text-xs text-muted-foreground">
                    {t("cause_label")}: <span className="capitalize">{disease.cause}</span>
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {disease.symptoms && (
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">{t("symptoms")}</p>
                    <p className="text-sm">{disease.symptoms}</p>
                  </div>
                )}
                {disease.treatment?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5" />{t("treatment_steps")}
                    </p>
                    <ol className="space-y-1.5">
                      {disease.treatment.map((step, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {disease.prevention?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />{t("prevention_tips")}
                    </p>
                    <ul className="space-y-1.5">
                      {disease.prevention.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="flex-shrink-0 text-blue-500 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

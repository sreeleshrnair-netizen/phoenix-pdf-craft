'use client';

import { useState, useEffect, DragEvent } from 'react';
import { convertImagesToPdf, ConvertOptions } from '@/lib/imageToPdf';
import AdBanner from '@/components/AdBanner';
import {
  UploadCloud,
  Trash2,
  Download,
  Loader2,
  ShieldCheck,
  Zap,
  Sparkles,
  Plus,
  RefreshCw,
  FileCheck2,
  Layout,
  Maximize2,
} from 'lucide-react';

interface ExtendedFile {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<ExtendedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [options, setOptions] = useState<ConvertOptions>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'small',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  const processFiles = (newFiles: File[]) => {
    const validImageFiles = newFiles.filter(
      (file) => file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
    );

    if (validImageFiles.length === 0) return;

    const newEntries: ExtendedFile[] = validImageFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newEntries]);
    setDownloadUrl(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return filtered;
    });
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    try {
      const pdfBlob = await convertImagesToPdf(
        files.map((f) => f.file),
        options
      );
      const url = URL.createObjectURL(pdfBlob);
      setDownloadUrl(url);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to generate PDF.');
    } finally {
      setIsConverting(false);
    }
  };

  const resetAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setDownloadUrl(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Phoenix PDF Craft
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
            Transform Images to PDF
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Ultra-fast visual PDF builder with custom page layouts. Zero upload delays, zero server retention.
          </p>
        </div>

        {/* Top Banner Ad Place */}
        <AdBanner dataAdSlot="1234567890" />

        {files.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative"
            >
              <label className="group relative cursor-pointer block">
                <div
                  className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition duration-500 blur-xl ${
                    isDragging ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'
                  }`}
                />
                <div
                  className={`relative rounded-3xl bg-slate-900/90 border p-12 text-center transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-950/20'
                      : 'border-slate-800 group-hover:border-slate-700'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isDragging ? 'Drop your images here' : 'Drop JPG or PNG images here'}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Or click to select multiple files at once
                  </p>
                  <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/25">
                    Select Images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">Pages ({files.length})</span>
                  <span className="text-xs text-slate-400">Preview layout</span>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                    <Plus className="w-4 h-4" />
                    <span>Add More</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={resetAll}
                    className="text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center space-x-1 bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-2">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-3 flex flex-col justify-between hover:border-indigo-500/50 transition-all"
                  >
                    <div className="absolute top-5 left-5 z-10 bg-slate-900/90 text-slate-200 text-xs font-bold px-2 py-1 rounded-md border border-slate-700/80">
                      #{index + 1}
                    </div>

                    <button
                      onClick={() => removeFile(item.id)}
                      className="absolute top-5 right-5 z-10 bg-slate-900/90 hover:bg-red-500 text-slate-300 hover:text-white p-1.5 rounded-md border border-slate-700/80 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center mb-3">
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-left">
                      <p className="text-xs font-medium text-slate-300 truncate">{item.file.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                <Layout className="w-5 h-5 text-indigo-400" />
                <span>Document Options</span>
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Page Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['portrait', 'landscape'] as const).map((orient) => (
                      <button
                        key={orient}
                        onClick={() => setOptions((prev) => ({ ...prev, orientation: orient }))}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                          options.orientation === orient
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {orient}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Page Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'a4', label: 'Standard A4' },
                      { id: 'fit', label: 'Fit Image Size' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() =>
                          setOptions((prev) => ({ ...prev, pageSize: fmt.id as 'a4' | 'fit' }))
                        }
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          options.pageSize === fmt.id
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Margin Padding
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'small', 'large'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setOptions((prev) => ({ ...prev, margin: m }))}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                          options.margin === m
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {!downloadUrl ? (
                    <button
                      onClick={handleConvert}
                      disabled={isConverting}
                      className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isConverting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <FileCheck2 className="w-5 h-5" />
                      )}
                      <span>{isConverting ? 'Generating PDF...' : 'Convert to PDF'}</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <a
                        href={downloadUrl}
                        download="converted.pdf"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download PDF</span>
                      </a>
                      <button
                        onClick={() => setDownloadUrl(null)}
                        className="w-full text-xs text-slate-400 hover:text-white py-2"
                      >
                        Re-adjust options
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner Ad Place */}
        <AdBanner dataAdSlot="0987654321" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">100% Client-Side</h4>
            <p className="text-slate-400 text-sm">
              Your files never hit any server. Conversions run securely in your browser memory.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Instant Speed</h4>
            <p className="text-slate-400 text-sm">
              No uploading or queueing delays. Build multi-page PDFs instantly.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
              <Maximize2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-1">Full Layout Controls</h4>
            <p className="text-slate-400 text-sm">
              Adjust page orientations, standard margins, and paper formats with live preview.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
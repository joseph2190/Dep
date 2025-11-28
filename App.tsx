import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ComparisonView } from './components/ComparisonView';
import { Button } from './components/Button';
import { generateDepthEffect } from './services/geminiService';
import { ImageFile, AppState } from './types';
import { downloadImage } from './utils/fileUtils';
import { Wand2, Download, Trash2, AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [resultImageBase64, setResultImageBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (image: ImageFile) => {
    setSourceImage(image);
    setResultImageBase64(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const resultBase64 = await generateDepthEffect(sourceImage.base64, sourceImage.mimeType);
      setResultImageBase64(resultBase64);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("Failed to generate depth effect. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleDownload = () => {
    if (resultImageBase64) {
      const mimeType = sourceImage?.mimeType || 'image/png';
      const url = `data:${mimeType};base64,${resultImageBase64}`;
      downloadImage(url, `focus-ai-depth-effect-${Date.now()}.${mimeType.split('/')[1]}`);
    }
  };

  const handleReset = () => {
    setSourceImage(null);
    setResultImageBase64(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="space-y-12">
          
          {/* Hero Section */}
          {!sourceImage && (
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Add Cinematic Depth <br />
                <span className="text-indigo-400">to Any Photo</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Upload a photo and let our AI instantly identify the subject and apply 
                a realistic, high-quality bokeh effect to the background.
              </p>
            </div>
          )}

          {/* Workflow Area */}
          <div className="w-full mx-auto">
            {!sourceImage ? (
              <div className="max-w-xl mx-auto">
                <ImageUploader onImageSelected={handleImageSelected} />
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                
                {/* Result View or Preview */}
                <div className="bg-slate-800/50 rounded-2xl p-4 md:p-6 border border-slate-700/50">
                  {appState === AppState.COMPLETE && resultImageBase64 ? (
                    <ComparisonView 
                      originalUrl={sourceImage.previewUrl}
                      processedUrl={`data:${sourceImage.mimeType};base64,${resultImageBase64}`}
                    />
                  ) : (
                    <div className="relative w-full aspect-[4/3] md:aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                      <img 
                        src={sourceImage.previewUrl} 
                        alt="Preview" 
                        className={`w-full h-full object-contain ${appState === AppState.PROCESSING ? 'opacity-50 blur-sm scale-105 transition-all duration-1000' : ''}`}
                      />
                      {appState === AppState.PROCESSING && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-white font-medium text-lg animate-pulse">Analyzing Depth Map...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-sm sticky bottom-4 shadow-2xl z-40">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="secondary" 
                      onClick={handleReset}
                      disabled={appState === AppState.PROCESSING}
                      icon={<Trash2 size={18} />}
                    >
                      New Image
                    </Button>
                    {appState === AppState.ERROR && (
                      <div className="flex items-center text-red-400 text-sm">
                        <AlertCircle size={18} className="mr-2" />
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {appState === AppState.IDLE || appState === AppState.ERROR ? (
                      <Button 
                        onClick={handleGenerate} 
                        size="lg"
                        icon={<Wand2 size={20} />}
                      >
                        Generate Depth Effect
                      </Button>
                    ) : appState === AppState.COMPLETE ? (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={handleGenerate}
                          title="Regenerate"
                        >
                          <RefreshCw size={20} />
                        </Button>
                        <Button 
                          onClick={handleDownload} 
                          size="lg"
                          className="bg-green-600 hover:bg-green-700 shadow-green-500/30"
                          icon={<Download size={20} />}
                        >
                          Download HD
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800 bg-slate-900">
        <p>© {new Date().getFullYear()} FocusAI. Built with Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
};

export default App;

import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';
import { Button } from './Button';

export const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Ensure we just get the base64 part for Gemini if needed, but usually data URL is fine for display.
        // For Gemini API, we need to strip the prefix "data:image/png;base64,".
        setSelectedImage(base64String);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;
    
    setIsProcessing(true);
    try {
      // Strip header for API
      const base64Data = selectedImage.split(',')[1]; 
      const resultBase64 = await editImageWithGemini(base64Data, prompt);
      
      if (resultBase64) {
        setProcessedImage(`data:image/png;base64,${resultBase64}`);
      }
    } catch (error) {
      console.error("Failed to edit image", error);
      alert("Erreur lors de la modification de l'image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Wand2 className="text-purple-600" />
          Éditeur Magic IA (Nano Banana)
        </h3>
        <p className="text-slate-500 text-sm">
          Utilisez l'IA pour modifier vos documents ou photos de profil. Exemple : "Ajouter un filtre rétro", "Enlever l'arrière-plan".
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              selectedImage ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Original" className="h-full w-full object-contain rounded-lg p-2" />
            ) : (
              <div className="text-center p-4">
                <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 font-medium">Cliquez pour uploader une image</p>
                <p className="text-xs text-slate-400">PNG, JPG supportés</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {selectedImage && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Prompt de modification</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Rendre l'image plus claire..."
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={isProcessing || !prompt}
                  className="bg-purple-600 hover:bg-purple-700"
                  isLoading={isProcessing}
                >
                  <Wand2 size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="border border-slate-200 rounded-xl h-64 md:h-auto bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
           {processedImage ? (
             <>
               <img src={processedImage} alt="Processed" className="h-full w-full object-contain p-2" />
               <a 
                 href={processedImage} 
                 download="edited-image.png"
                 className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-slate-800 transition-all"
               >
                 <Download size={20} />
               </a>
             </>
           ) : (
             <div className="text-center p-4 opacity-50">
               {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="animate-spin h-8 w-8 text-purple-500 mb-2" />
                    <p>Génération par l'IA en cours...</p>
                  </div>
               ) : (
                 <>
                   <ImageIcon className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                   <p className="text-sm">Le résultat apparaîtra ici</p>
                 </>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Đảm bảo đã import

import {
  DrawingCanvas,
  type DrawingCanvasRef,
} from "@/components/drawing-canvas";
import { PredictionDisplay } from "@/components/prediction-display";
import { Brain, Eraser, Upload, ImageIcon } from "lucide-react"; // Import thêm icon

export default function HomePage() {
  const canvasRef = useRef<DrawingCanvasRef>(null);

  // State
  const [prediction, setPrediction] = useState<{
    digit: number;
    confidence: number;
    probabilities: number[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // State mới cho phần Upload
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);

  // Hàm xử lý chung cho việc gửi API
  const sendToApi = async (dataUrl: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        // Nhớ trỏ đúng port backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) throw new Error("Prediction failed");

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error(error);
      alert("Error processing image. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Xử lý khi vẽ xong
  const handleCanvasPredict = (canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL("image/png");
    sendToApi(dataUrl);
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    setPrediction(null);
    setUploadedImagePreview(null);
  };

  // 2. Xử lý khi upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImagePreview(base64String);
        setPrediction(null); // Reset kết quả cũ
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPredict = () => {
    if (uploadedImagePreview) {
      sendToApi(uploadedImagePreview);
    }
  };

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header giữ nguyên */}
      <header className='border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary/10 p-2 rounded-lg'>
              <Brain className='w-6 h-6 text-primary' />
            </div>
            <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
              MNIST Recognizer
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-2 gap-6 mb-8'>
          {/* INPUT SECTION: Dùng Tabs để chuyển đổi */}
          <Card className='p-6 border-border/50 bg-card/50 backdrop-blur-sm h-fit'>
            <Tabs defaultValue='draw' className='w-full'>
              <div className='flex items-center justify-between mb-4'>
                <TabsList>
                  <TabsTrigger value='draw'>Draw Digit</TabsTrigger>
                  <TabsTrigger value='upload'>Upload Image</TabsTrigger>
                </TabsList>

                {/* Nút Clear chỉ hiện khi vẽ */}
                <TabsContent value='draw' className='m-0 flex-none'>
                  <Button variant='outline' size='sm' onClick={handleClear}>
                    <Eraser className='w-4 h-4 mr-2' />
                    Clear
                  </Button>
                </TabsContent>
              </div>

              {/* TAB 1: VẼ (Giữ nguyên component cũ) */}
              <TabsContent value='draw' className='mt-0'>
                <DrawingCanvas
                  ref={canvasRef}
                  onPredict={handleCanvasPredict} // Đổi tên hàm truyền vào
                  onClear={() => setPrediction(null)}
                />
              </TabsContent>

              {/* TAB 2: UPLOAD (Mới thêm) */}
              <TabsContent value='upload' className='mt-0 space-y-4'>
                <div className='border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[280px] bg-muted/20'>
                  {!uploadedImagePreview ? (
                    <div className='text-center space-y-4'>
                      <button
                        className='bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto cursor-pointer hover:bg-muted/80 transition-colors'
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        <Upload className='w-8 h-8 text-muted-foreground hover:text-primary transition-colors' />
                      </button>
                      <div>
                        <label
                          htmlFor='image-upload'
                          className='cursor-pointer hover:text-primary transition-colors'
                        >
                          <span className='font-semibold text-lg'>
                            Click to upload an image
                          </span>
                        </label>
                        <input
                          id='image-upload'
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={handleImageUpload}
                        />
                        <p className='text-xs text-muted-foreground mt-2'>
                          Supports JPG, PNG
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='relative w-full h-full flex flex-col items-center'>
                      <div className='relative w-48 h-48 mb-4 border border-border rounded overflow-hidden'>
                        <img
                          src={uploadedImagePreview}
                          alt='Uploaded'
                          className='w-full h-full object-contain bg-white'
                        />
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          onClick={handleUploadPredict}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Predict This Image"}
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => setUploadedImagePreview(null)}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* PREDICTION SECTION (Giữ nguyên) */}
          <Card className='p-6 border-border/50 bg-card/50 backdrop-blur-sm h-fit'>
            <h2 className='text-xl font-semibold mb-4'>Prediction Results</h2>
            {prediction ? (
              <PredictionDisplay prediction={prediction} />
            ) : (
              <div className='flex items-center justify-center h-[350px] text-muted-foreground border-2 border-dashed border-border/30 rounded-lg'>
                <div className='text-center'>
                  <Brain className='w-12 h-12 mx-auto mb-2 opacity-50' />
                  <p>Input a digit to see predictions</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Phần Model Info hoặc Feature Visualization giữ nguyên nếu muốn */}
      </main>
    </div>
  );
}

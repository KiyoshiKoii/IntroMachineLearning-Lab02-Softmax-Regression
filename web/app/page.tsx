"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DrawingCanvas } from "@/components/drawing-canvas"
import { PredictionDisplay } from "@/components/prediction-display"
import { ModelInfo } from "@/components/model-info"
import { FeatureVisualization } from "@/components/feature-visualization"
import { Brain, Eraser } from "lucide-react"

export default function HomePage() {
  const [prediction, setPrediction] = useState<{
    digit: number
    confidence: number
    probabilities: number[]
  } | null>(null)
  const [imageData, setImageData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async (canvas: HTMLCanvasElement) => {
    setLoading(true)
    try {
      // Get image data from canvas
      const dataUrl = canvas.toDataURL("image/png")
      setImageData(dataUrl)

      // Send to prediction API
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      })

      if (!response.ok) throw new Error("Prediction failed")

      const result = await response.json()
      setPrediction(result)
    } catch (error) {
      console.error("[v0] Prediction error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPrediction(null)
    setImageData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">MNIST Digit Recognition</h1>
                <p className="text-sm text-muted-foreground">Softmax Regression Demo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Drawing Section */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Draw a Digit</h2>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Eraser className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
            <DrawingCanvas onPredict={handlePredict} onClear={handleClear} />
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" size="lg" disabled={loading}>
                <Brain className="w-4 h-4 mr-2" />
                {loading ? "Analyzing..." : "Predict Digit"}
              </Button>
            </div>
          </Card>

          {/* Prediction Section */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
            {prediction ? (
              <PredictionDisplay prediction={prediction} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Draw a digit to see predictions</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Information Tabs */}
        <Tabs defaultValue="model" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="model">Model Info</TabsTrigger>
            <TabsTrigger value="features">Feature Design</TabsTrigger>
            <TabsTrigger value="about">About Project</TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="mt-6">
            <ModelInfo />
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <FeatureVisualization imageData={imageData} />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3">About This Project</h3>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  This is a demonstration of <strong className="text-foreground">Softmax Regression</strong> for
                  handwritten digit classification using the MNIST dataset.
                </p>
                <p>
                  The model is implemented from scratch using NumPy, without high-level ML frameworks like TensorFlow or
                  PyTorch. It demonstrates the mathematical foundations of classification algorithms.
                </p>
                <p>
                  <strong className="text-foreground">Key Features:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Manual Softmax Regression implementation</li>
                  <li>Multiple feature vector designs</li>
                  <li>Real-time digit recognition</li>
                  <li>Probability distribution visualization</li>
                  <li>Interactive drawing canvas</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Machine Learning Lab 02 - Softmax Regression Project
          </p>
        </div>
      </footer>
    </div>
  )
}

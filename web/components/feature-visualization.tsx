"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeatureVisualizationProps {
  imageData: string | null
}

export function FeatureVisualization({ imageData }: FeatureVisualizationProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Feature Vector Designs</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          This project implements three different feature extraction methods to improve model performance:
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="space-y-3 p-4 border border-border rounded-lg bg-background/50">
            <Badge variant="secondary">Feature 1</Badge>
            <h4 className="font-semibold text-sm">Normalized Pixel Intensity</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Raw pixel values normalized to [0, 1] range. Flattens 28×28 image to 784-dimensional vector.
            </p>
            <div className="bg-muted/30 p-2 rounded text-xs font-mono">x = pixels / 255.0</div>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3 p-4 border border-border rounded-lg bg-background/50">
            <Badge variant="secondary">Feature 2</Badge>
            <h4 className="font-semibold text-sm">Edge-based Features</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Applies Sobel edge detection to emphasize digit contours and boundaries, reducing noise.
            </p>
            <div className="bg-muted/30 p-2 rounded text-xs font-mono">edges = sobel_filter(img)</div>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3 p-4 border border-border rounded-lg bg-background/50">
            <Badge variant="secondary">Feature 3</Badge>
            <h4 className="font-semibold text-sm">Block Averaging</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Divides image into 4×4 blocks and averages intensity, creating more robust features (196-dim).
            </p>
            <div className="bg-muted/30 p-2 rounded text-xs font-mono">features = block_avg(7×7)</div>
          </div>
        </div>
      </Card>

      {imageData && (
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Current Input Visualization</h3>
          <div className="flex items-center justify-center">
            <div className="border-2 border-border rounded-lg p-4 bg-black">
              <img src={imageData || "/placeholder.svg"} alt="Drawn digit" className="w-[280px] h-[280px]" />
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            This image is processed through the feature extraction pipeline before prediction
          </p>
        </Card>
      )}
    </div>
  )
}

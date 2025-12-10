import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ModelInfo() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Model Architecture</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">
              Input
            </Badge>
            <div className="flex-1">
              <p className="font-medium">Feature Vector</p>
              <p className="text-muted-foreground text-xs">784 dimensions (28×28 pixels)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">
              Model
            </Badge>
            <div className="flex-1">
              <p className="font-medium">Softmax Regression</p>
              <p className="text-muted-foreground text-xs">Linear classifier with softmax activation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">
              Output
            </Badge>
            <div className="flex-1">
              <p className="font-medium">10 Classes</p>
              <p className="text-muted-foreground text-xs">Digits 0-9 with probability distribution</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Mathematical Formulation</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium mb-1">Softmax Function:</p>
            <div className="bg-muted/50 p-3 rounded-md font-mono text-xs overflow-x-auto">
              $$P(y=k|x) = \frac{"{e^{z_k}}"}
              {"{\\sum_{j=1}^{K} e^{z_j}}"}$$
            </div>
          </div>
          <div>
            <p className="font-medium mb-1">Cross-Entropy Loss:</p>
            <div className="bg-muted/50 p-3 rounded-md font-mono text-xs overflow-x-auto">
              $$L = -\frac{"{1}"}
              {"{m}"} \sum_{"{i=1}"}^{"{m}"} \sum_{"{k=1}"}^{"{K}"} y_k^{"{(i)}"} \log(\hat{"{y}"}_k^{"{(i)}"})$$
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Implementation Details</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">Framework</p>
            <p className="text-muted-foreground">NumPy (No TensorFlow/PyTorch)</p>
          </div>
          <div>
            <p className="font-medium mb-1">Optimization</p>
            <p className="text-muted-foreground">Gradient Descent</p>
          </div>
          <div>
            <p className="font-medium mb-1">Dataset</p>
            <p className="text-muted-foreground">MNIST (60k train, 10k test)</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

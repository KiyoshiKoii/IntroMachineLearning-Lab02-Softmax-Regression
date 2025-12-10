"use client"

import { Progress } from "@/components/ui/progress"

interface PredictionDisplayProps {
  prediction: {
    digit: number
    confidence: number
    probabilities: number[]
  }
}

export function PredictionDisplay({ prediction }: PredictionDisplayProps) {
  const { digit, confidence, probabilities } = prediction

  return (
    <div className="space-y-6">
      {/* Main Prediction */}
      <div className="text-center p-8 border border-border rounded-lg bg-primary/5">
        <p className="text-sm text-muted-foreground mb-2">Predicted Digit</p>
        <div className="text-8xl font-bold text-primary mb-2">{digit}</div>
        <p className="text-sm text-muted-foreground">
          Confidence: <span className="font-semibold text-foreground">{(confidence * 100).toFixed(2)}%</span>
        </p>
      </div>

      {/* Probability Distribution */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground">Probability Distribution</h3>
        {probabilities.map((prob, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className={idx === digit ? "font-semibold text-primary" : "text-muted-foreground"}>
                Digit {idx}
              </span>
              <span className={idx === digit ? "font-semibold text-primary" : "text-muted-foreground"}>
                {(prob * 100).toFixed(2)}%
              </span>
            </div>
            <Progress value={prob * 100} className={cn("h-2", idx === digit && "bg-primary/20")} />
          </div>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

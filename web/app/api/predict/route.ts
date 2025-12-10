import { type NextRequest, NextResponse } from "next/server"

// Mock prediction function (would normally call Python model)
function mockPredict(imageData: string) {
  // In a real implementation, this would:
  // 1. Send image to Python backend
  // 2. Preprocess image (resize to 28x28, normalize)
  // 3. Extract features
  // 4. Run through Softmax Regression model
  // 5. Return probabilities

  // For demo purposes, generate mock probabilities
  const probabilities = Array(10)
    .fill(0)
    .map(() => Math.random())
  const sum = probabilities.reduce((a, b) => a + b, 0)
  const normalizedProbs = probabilities.map((p) => p / sum)

  // Find digit with highest probability
  const digit = normalizedProbs.indexOf(Math.max(...normalizedProbs))
  const confidence = normalizedProbs[digit]

  return {
    digit,
    confidence,
    probabilities: normalizedProbs,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Process image and get prediction
    const result = mockPredict(image)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Prediction API error:", error)
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}

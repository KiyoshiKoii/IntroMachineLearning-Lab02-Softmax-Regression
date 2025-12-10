import { type NextRequest, NextResponse } from "next/server"

// Python model service URL
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Call Python model service
    const response = await fetch(`${PYTHON_SERVICE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[API] Python service error:", error)
      return NextResponse.json(
        { error: error.error || "Prediction failed" },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[API] Prediction error:", error)
    
    // Check if Python service is running
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { 
          error: "Python model service is not running. Please start it with: cd python_service && python model_service.py" 
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}

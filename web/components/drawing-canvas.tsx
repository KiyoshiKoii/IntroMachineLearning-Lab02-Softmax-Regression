"use client";

import type React from "react";

import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "@/lib/utils";

export interface DrawingCanvasRef {
  clear: () => void;
}

interface DrawingCanvasProps {
  onPredict: (canvas: HTMLCanvasElement) => void;
  onClear: () => void;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ onPredict, onClear }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useImperativeHandle(ref, () => ({
      clear: clearCanvas,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Initialize canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      draw(e);
    };

    const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        onPredict(canvas);
      }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing && e.type !== "mousedown") return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

      if (e.type === "mousedown") {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onClear();
    };

    // Touch support
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvasRef.current?.dispatchEvent(mouseEvent);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvasRef.current?.dispatchEvent(mouseEvent);
    };

    const handleClear = () => {
      clearCanvas();
    };

    return (
      <div className='space-y-2'>
        <div className='border-2 border-border rounded-lg overflow-hidden bg-black'>
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className={cn("w-full h-auto cursor-crosshair touch-none")}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={stopDrawing}
          />
        </div>
        <p className='text-xs text-muted-foreground text-center'>
          Draw a digit (0-9) in the canvas above
        </p>
      </div>
    );
  }
);
DrawingCanvas.displayName = "DrawingCanvas";

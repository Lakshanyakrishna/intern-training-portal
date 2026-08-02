import React, { useRef, useEffect } from 'react';

const ShapeGrid = ({
  direction = 'diagonal',
  speed = 0.3,
  squareSize = 16,
  shape = 'square',
  borderColor = 'rgba(255,255,255,0.06)',
  hoverFillColor = 'rgba(255,255,255,0.03)',
  hoverTrailAmount = 0,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = 0;
    let height = 0;
    
    let offsetX = 0;
    let offsetY = 0;
    
    let mouseX = -1000;
    let mouseY = -1000;
    
    const resize = () => {
      if (canvas.parentElement) {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (direction === 'diagonal') {
        offsetX -= speed;
        offsetY -= speed;
      } else if (direction === 'up') {
        offsetY -= speed;
      } else if (direction === 'down') {
        offsetY += speed;
      } else if (direction === 'left') {
        offsetX -= speed;
      } else if (direction === 'right') {
        offsetX += speed;
      }
      
      offsetX = offsetX % squareSize;
      offsetY = offsetY % squareSize;
      
      const startX = offsetX - squareSize;
      const startY = offsetY - squareSize;
      
      const cols = Math.ceil(width / squareSize) + 2;
      const rows = Math.ceil(height / squareSize) + 2;
      
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + i * squareSize;
          const y = startY + j * squareSize;
          
          ctx.beginPath();
          if (shape === 'square') {
            ctx.rect(x, y, squareSize, squareSize);
          } else if (shape === 'circle') {
            ctx.arc(x + squareSize/2, y + squareSize/2, squareSize/2 - 2, 0, Math.PI * 2);
          } else if (shape === 'triangle') {
            ctx.moveTo(x + squareSize/2, y);
            ctx.lineTo(x + squareSize, y + squareSize);
            ctx.lineTo(x, y + squareSize);
            ctx.closePath();
          } else if (shape === 'hexagon') {
            const hexSize = squareSize / 2;
            for (let k = 0; k < 6; k++) {
              const angle = (Math.PI / 3) * k;
              const hx = x + squareSize/2 + hexSize * Math.cos(angle);
              const hy = y + squareSize/2 + hexSize * Math.sin(angle);
              if (k === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
          }
          ctx.stroke();
          
          if (
            mouseX >= x && mouseX < x + squareSize &&
            mouseY >= y && mouseY < y + squareSize
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, squareSize, shape, borderColor, hoverFillColor, hoverTrailAmount]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="shape-grid-canvas"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ShapeGrid;

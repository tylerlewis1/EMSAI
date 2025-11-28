import { useEffect, useRef } from "react";

export default function PlethWave({ spo2 }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    let x = 0;
    const W = canvas.width;
    const H = canvas.height;

    function loop() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < W; i++) {
        const px = (i + x) % W;
        const y = H / 2 + Math.sin(px / 30) * 20;

        ctx.lineTo(i, y);
      }

      ctx.stroke();

      x += 1.5;
      requestAnimationFrame(loop);
    }

    loop();
  }, [spo2]);

  return <canvas ref={ref} width={600} height={100} className="wave-canvas" />;
}

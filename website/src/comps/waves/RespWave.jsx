import { useEffect, useRef } from "react";

export default function RespWave({ rate }) {
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

      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const period = 600 / rate;

      for (let i = 0; i < W; i++) {
        const px = (i + x) % W;
        const y = H / 2 + Math.sin(px / period) * 30;

        ctx.lineTo(i, y);
      }

      ctx.stroke();

      x += 0.7;
      requestAnimationFrame(loop);
    }

    loop();
  }, [rate]);

  return <canvas ref={ref} width={600} height={80} className="wave-canvas" />;
}

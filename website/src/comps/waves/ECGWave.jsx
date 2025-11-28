import { useEffect, useRef } from "react";

export default function ECGWave({ heartRate }) {
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

      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < W; i++) {
        const px = (i + x) % W;
        let y = H / 2;

        if (px === 40) y = 10;
        if (px === 50) y = 80;
        if (px === 60) y = 30;
        if (px === 70) y = 60;

        ctx.lineTo(i, y);
      }

      ctx.stroke();

      x += (heartRate / 60) * 2;

      requestAnimationFrame(loop);
    }

    loop();
  }, [heartRate]);

  return <canvas ref={ref} width={600} height={100} className="wave-canvas" />;
}

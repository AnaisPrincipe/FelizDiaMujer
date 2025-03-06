// Evento submit del formulario
document.getElementById('flowerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const userName = document.getElementById('userName').value;
  const flowerType = document.getElementById('flowerType').value;
  
  if (!flowerType) {
    alert("Por favor, selecciona una flor.");
    return;
  }
  
  // Mostrar el canvas y (comentado) la sección de compartir
  document.getElementById('result').classList.remove('hidden');
  // document.getElementById('shareSection').classList.remove('hidden');
  
  startBouquetAnimation(flowerType, userName);
});

// Colores de las flores:
// - Margarita: rojo (#FF0000)
// - Girasol: amarillo (#FFD700)
// - Gerbera: morado (#9C27B0)
function getFlowerColor(type) {
  switch(type) {
    case "margarita":
      return "#FF0000";
    case "girasol":
      return "#FFD700";
    case "gerbera":
      return "#9C27B0";
    default:
      return "#FFC0CB";
  }
}

let animationId;
let growth = 0;

function startBouquetAnimation(flowerType, userName) {
  const canvas = document.getElementById('flowerCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  if (animationId) cancelAnimationFrame(animationId);
  growth = 0;
  
  const messages = [
    "Mujer, tu fuerza ilumina el camino hacia un mañana brillante.",
    "Que cada día te regale nuevas oportunidades para brillar.",
    "Hoy y siempre, tu luz inspira al mundo entero.",
    "Celebremos juntas la gracia y la fortaleza que te definen."
  ];
  const deepMessage = messages[Math.floor(Math.random() * messages.length)];
  
  const stems = [];
  const numStems = 8;
  
  if (flowerType === "girasol") {
    const gap = 100;
    const totalWidth = gap * (numStems - 1);
    const startX = (width - totalWidth) / 2;
    for (let i = 0; i < numStems; i++) {
      const x = startX + i * gap;
      const h = 120 + Math.random() * 60;
      const flowerScale = 0.6 + Math.random() * 0.3;
      stems.push({ x, stemHeight: h, flowerScale });
    }
  } else {
    let marginLeft = 80, marginRight = 80;
    const effectiveWidth = width - marginLeft - marginRight;
    for (let i = 0; i < numStems; i++) {
      const x = marginLeft + (i * effectiveWidth) / (numStems - 1);
      const h = 120 + Math.random() * 60;
      stems.push({ x, stemHeight: h });
    }
  }
  
  function animate() {
    growth += 0.002;
    if (growth > 1) growth = 1;
    
    const wind = Math.sin(Date.now() * 0.001) * 5;
    
    drawBackground(ctx, width, height);
    
    const color = getFlowerColor(flowerType);
    const baseY = height - 20;
    stems.forEach(stem => {
      let actualScale = growth;
      if (flowerType === "girasol" && stem.flowerScale) {
        actualScale = growth * stem.flowerScale;
      }
      drawStemAndFlower(ctx, stem.x + wind, baseY, stem.stemHeight, color, flowerType, actualScale);
    });
    
    drawCanvasText(ctx, userName, deepMessage);
    
    if (growth < 1) {
      animationId = requestAnimationFrame(animate);
    }
  }
  
  animate();
}

function drawCanvasText(ctx, userName, message) {
  ctx.save();
  ctx.textAlign = 'center';
  
  ctx.font = '28px Arial';
  ctx.fillStyle = '#4A148C';
  ctx.fillText(`¡Feliz Día de la Mujer, ${userName}!`, ctx.canvas.width / 2, 60);
  
  ctx.font = '20px Arial';
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText(message, ctx.canvas.width / 2, 100);
  
  ctx.restore();
}

// Fondo del canvas: degradado rosado-lila
function drawBackground(ctx, width, height) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, "#FDE7F1");
  grad.addColorStop(1, "#F8D0E2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

// Flores y tallos
function drawStemAndFlower(ctx, baseX, baseY, stemHeight, color, flowerType, scale) {
  const currentHeight = stemHeight * scale;
  
  ctx.beginPath();
  ctx.strokeStyle = "#0b6b0b";
  ctx.lineWidth = 3;
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX, baseY - currentHeight);
  ctx.stroke();
  
  drawLeaf(ctx, baseX - 12 * scale, baseY - currentHeight * 0.4, -35, scale);
  drawLeaf(ctx, baseX + 12 * scale, baseY - currentHeight * 0.6, 35, scale);
  
  drawFlower(ctx, baseX, baseY - currentHeight, flowerType, color, scale);
}

function drawLeaf(ctx, x, y, rotateAngle, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((Math.PI / 180) * rotateAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(10 * scale, -15 * scale, 0, -30 * scale);
  ctx.quadraticCurveTo(-10 * scale, -15 * scale, 0, 0);
  ctx.closePath();
  ctx.fillStyle = "#2ecc71";
  ctx.fill();
  ctx.restore();
}

function drawFlower(ctx, x, y, type, color, scale) {
  switch (type) {
    case "margarita":
      drawMargarita(ctx, x, y, color, scale);
      break;
    case "girasol":
      drawGirasol(ctx, x, y, color, scale);
      break;
    case "gerbera":
      drawGerbera(ctx, x, y, color, scale);
      break;
    default:
      drawMargarita(ctx, x, y, color, scale);
  }
}

function drawMargarita(ctx, x, y, color, scale) {
  const petals = 16;
  const petalWidth = 10 * scale;
  const petalHeight = 20 * scale;
  for (let i = 0; i < petals; i++) {
    const angle = (2 * Math.PI / petals) * i;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -petalHeight, petalWidth, petalHeight, 0, 0, 2 * Math.PI);
    ctx.fillStyle = color; // #FF0000
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(x, y, 8 * scale, 0, 2 * Math.PI);
  ctx.fillStyle = "#F1C40F";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

function drawGirasol(ctx, x, y, color, scale) {
  const factor = 0.8;
  const petals = 16;
  const petalWidth = 6 * scale * factor;
  const petalHeight = 40 * scale * factor;
  for (let i = 0; i < petals; i++) {
    const angle = (2 * Math.PI / petals) * i;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -petalHeight, petalWidth, petalHeight, 0, 0, 2 * Math.PI);
    ctx.fillStyle = color; // #FFD700
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(x, y, 20 * scale * factor, 0, 2 * Math.PI);
  ctx.fillStyle = "#8B4513";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

function drawGerbera(ctx, x, y, color, scale) {
  const petals = 12;
  const petalWidth = 8 * scale;
  const petalHeight = 20 * scale;
  for (let i = 0; i < petals; i++) {
    const angle = (2 * Math.PI / petals) * i;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -petalHeight, petalWidth, petalHeight, 0, 0, 2 * Math.PI);
    ctx.fillStyle = color; // #9C27B0
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(x, y, 10 * scale, 0, 2 * Math.PI);
  ctx.fillStyle = "#4b2e2e";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

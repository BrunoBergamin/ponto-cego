/* ============================================================
   PONTO CEGO · cena 3D do hero (Three.js / WebGL)
   Um orbe de pontos girando, com um "ponto cego" escuro que
   reage ao mouse. Degrada com elegância se o WebGL falhar.
   ============================================================ */
(function () {
  var canvas = document.getElementById("bg3d");
  if (!canvas) return;

  // Sem Three.js (CDN falhou) ou sem WebGL: ativa fundo CSS de fallback.
  if (typeof THREE === "undefined" || !temWebGL()) {
    document.body.classList.add("no3d");
    return;
  }

  var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // device fraco: celular / poucos núcleos -> versão mais leve
  var fraco = (matchMedia("(pointer: coarse)").matches) || (navigator.hardwareConcurrency || 8) <= 4;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !fraco, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, fraco ? 1.5 : 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 7.2;

  // grupo que gira inteiro
  var orbe = new THREE.Group();
  scene.add(orbe);

  // ---- esfera de pontos (o "negócio") ----
  var R = 2.45;
  var geoPts = new THREE.BufferGeometry();
  var N = fraco ? 800 : 1500;
  var pos = new Float32Array(N * 3);
  var dir = []; // guarda a direção de cada ponto para colorir o setor escuro
  for (var i = 0; i < N; i++) {
    // distribuição esférica uniforme (golden spiral)
    var y = 1 - (i / (N - 1)) * 2;
    var rad = Math.sqrt(1 - y * y);
    var theta = 2.399963 * i;
    var x = Math.cos(theta) * rad;
    var z = Math.sin(theta) * rad;
    pos[i * 3] = x * R;
    pos[i * 3 + 1] = y * R;
    pos[i * 3 + 2] = z * R;
    dir.push(new THREE.Vector3(x, y, z));
  }
  geoPts.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  // cores: maioria roxa/azul, o setor do "ponto cego" fica apagado
  var cores = new Float32Array(N * 3);
  var pontoCego = new THREE.Vector3(1, 0.15, 0.6).normalize(); // direção do setor cego
  var cA = new THREE.Color(0x7c5cff); // roxo
  var cB = new THREE.Color(0x36c5e0); // ciano
  var cDark = new THREE.Color(0x141019); // quase apagado
  for (var j = 0; j < N; j++) {
    var d = dir[j].dot(pontoCego); // 1 = bem no centro do setor cego
    var c;
    if (d > 0.78) {
      c = cDark; // dentro do ponto cego
    } else {
      var t = (dir[j].y + 1) / 2;
      c = cA.clone().lerp(cB, t);
    }
    cores[j * 3] = c.r; cores[j * 3 + 1] = c.g; cores[j * 3 + 2] = c.b;
  }
  geoPts.setAttribute("color", new THREE.BufferAttribute(cores, 3));

  var matPts = new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true, opacity: 0.95,
    depthWrite: false, blending: THREE.AdditiveBlending
  });
  var pontos = new THREE.Points(geoPts, matPts);
  orbe.add(pontos);

  // ---- anel/halo do ponto cego (marca o setor escuro) ----
  var ringGeo = new THREE.RingGeometry(0.62, 0.72, 48);
  var ringMat = new THREE.MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  var ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(pontoCego.clone().multiplyScalar(R * 1.02));
  ring.lookAt(0, 0, 0);
  orbe.add(ring);

  // ---- wireframe interno sutil ----
  var wireGeo = new THREE.IcosahedronGeometry(R * 0.99, 1);
  var wireMat = new THREE.MeshBasicMaterial({ color: 0x2a2350, wireframe: true, transparent: true, opacity: 0.35 });
  orbe.add(new THREE.Mesh(wireGeo, wireMat));

  // ---- partículas de fundo (poeira) ----
  var dustGeo = new THREE.BufferGeometry();
  var ND = fraco ? 160 : 380;
  var dpos = new Float32Array(ND * 3);
  for (var k = 0; k < ND; k++) {
    dpos[k * 3] = (Math.random() - 0.5) * 22;
    dpos[k * 3 + 1] = (Math.random() - 0.5) * 14;
    dpos[k * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
  var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.03, color: 0x5560a0, transparent: true, opacity: 0.5, depthWrite: false
  }));
  scene.add(dust);

  // ---- mouse / device tilt ----
  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", function (e) {
    tx = (e.clientX / window.innerWidth - 0.5);
    ty = (e.clientY / window.innerHeight - 0.5);
  });
  window.addEventListener("deviceorientation", function (e) {
    if (e.gamma != null) { tx = Math.max(-0.5, Math.min(0.5, e.gamma / 60)); ty = Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 60)); }
  });

  function resize() {
    var h = canvas.clientHeight || canvas.parentElement.clientHeight;
    var w = canvas.clientWidth || canvas.parentElement.clientWidth;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // pausa quando a aba está oculta OU quando o hero saiu da viewport (economiza GPU/bateria)
  var abaOculta = false, foraDaTela = false;
  function estaPausado() { return abaOculta || foraDaTela; }
  document.addEventListener("visibilitychange", function () { abaOculta = document.hidden; });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (ents) {
      foraDaTela = !ents[0].isIntersecting;
    }, { threshold: 0.01 }).observe(canvas);
  }

  var t0 = 0;
  function loop(t) {
    requestAnimationFrame(loop);
    if (estaPausado()) { t0 = t; return; }
    var dt = (t - t0) / 1000; t0 = t;

    // rotação base contínua
    if (!reduzir) {
      orbe.rotation.y += 0.0018 + dt * 0.02;
      orbe.rotation.x = -0.18;
      dust.rotation.y += 0.0006;
    }

    // suaviza o tilt do mouse
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    orbe.rotation.y += mx * 0.02;
    orbe.rotation.x = -0.18 + my * 0.35;
    camera.position.x = mx * 1.2;
    camera.position.y = -my * 0.8;
    camera.lookAt(0, 0, 0);

    // pulso suave do anel do ponto cego
    var s = 1 + Math.sin(t * 0.0022) * 0.08;
    ring.scale.set(s, s, s);
    ring.material.opacity = 0.35 + Math.sin(t * 0.0022) * 0.18;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);

  function temWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }
})();

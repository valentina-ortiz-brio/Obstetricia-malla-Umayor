document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".ramo");

  if (!botones.length) {
    console.error("❌ No se encontraron botones con la clase .ramo");
    return;
  }

  const aprobadosGuardados = JSON.parse(localStorage.getItem("aprobados") || "[]");
  const ramosMap = {};

  botones.forEach(boton => {
    const codigo = boton.dataset.codigo;
    const prerequisitos = boton.dataset.prerrequisitos
      ? boton.dataset.prerrequisitos.split(" ").filter(Boolean)
      : [];

    const aprobado = aprobadosGuardados.includes(codigo);

    ramosMap[codigo] = { boton, prerequisitos, aprobado };

    // Aplicar estado inicial
    if (aprobado) {
      boton.classList.add("aprobado");
      boton.disabled = true;
    } else if (prerequisitos.length > 0 && !prerequisitos.includes("ALL")) {
      boton.disabled = true;
    }
  });

  const checkAllAprobados = () =>
    Object.values(ramosMap).every(r => r.aprobado);

  const actualizarDesbloqueos = () => {
    for (const [codigo, ramo] of Object.entries(ramosMap)) {
      if (!ramo.aprobado) {
        const requisitos = ramo.prerequisitos;

        const desbloqueado = requisitos.length === 0 ||
          requisitos.every(req => req === "ALL"
            ? checkAllAprobados()
            : ramosMap[req]?.aprobado);

        ramo.boton.disabled = !desbloqueado;
      }
    }
  };

  actualizarDesbloqueos();

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const codigo = boton.dataset.codigo;
      const ramo = ramosMap[codigo];

      if (!ramo.aprobado) {
        ramo.aprobado = true;
        boton.classList.add("aprobado");
        boton.disabled = true;

        const nuevosAprobados = Object.entries(ramosMap)
          .filter(([, d]) => d.aprobado)
          .map(([codigo]) => codigo);

        localStorage.setItem("aprobados", JSON.stringify(nuevosAprobados));

        actualizarDesbloqueos();
      }
    });
  });

  console.log("✅ Script cargado correctamente y ramos inicializados");
});

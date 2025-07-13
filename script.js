document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");

  const ramosMap = {};
  ramos.forEach(ramo => {
    const codigo = ramo.dataset.codigo;
    const prerequisitos = ramo.dataset.prerrequisitos
      ? ramo.dataset.prerrequisitos.split(" ").filter(p => p.trim())
      : [];

    ramosMap[codigo] = { boton: ramo, prerequisitos, aprobado: false };

    if (prerequisitos.length > 0 && !prerequisitos.includes("ALL")) {
      ramo.disabled = true;
    }
  });

  const checkAllAprobados = () => {
    return Object.values(ramosMap).every(r => r.aprobado);
  };

  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const codigo = ramo.dataset.codigo;
      const ramoData = ramosMap[codigo];

      ramo.classList.add("aprobado");
      ramo.disabled = true;
      ramoData.aprobado = true;

      for (const [codigoDestino, destino] of Object.entries(ramosMap)) {
        if (!destino.aprobado) {
          const cumplidos = destino.prerrequisitos.every(pr => ramosMap[pr]?.aprobado);
          if (cumplidos || destino.prerrequisitos.includes("ALL") && checkAllAprobados()) {
            destino.boton.disabled = false;
          }
        }
      }
    });
  });
});

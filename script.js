document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");

  const ramosMap = {};
  ramos.forEach(ramo => {
    const codigo = ramo.dataset.codigo;
    const prerequisitos = ramo.dataset.prerrequisitos
      ? ramo.dataset.prerrequisitos.split(" ")
      : [];

    ramosMap[codigo] = {
      boton: ramo,
      prerequisitos,
      aprobado: false
    };

    if (prerequisitos.length > 0) {
      ramo.disabled = true;
    }
  });

  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const codigo = ramo.dataset.codigo;
      const ramoData = ramosMap[codigo];

      ramoData.aprobado = true;
      ramo.classList.add("aprobado");
      ramo.disabled = true;

      // Revisión de desbloqueos
      for (const [codigoDestino, destino] of Object.entries(ramosMap)) {
        if (!destino.aprobado && destino.prerrequisitos.length > 0) {
          const cumplidos = destino.prerrequisitos.every(c => ramosMap[c]?.aprobado);
          if (cumplidos) {
            destino.boton.disabled = false;
          }
        }
      }
    });
  });
});

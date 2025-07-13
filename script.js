document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");
  const ramosMap = {};

  // Recuperar desde localStorage
  const aprobadosGuardados = JSON.parse(localStorage.getItem("aprobados") || "[]");

  // Inicializar todos los ramos y sus relaciones
  ramos.forEach(ramo => {
    const codigo = ramo.dataset.codigo;
    const prerequisitos = ramo.dataset.prerrequisitos
      ? ramo.dataset.prerrequisitos.trim().split(" ").filter(Boolean)
      : [];

    const aprobado = aprobadosGuardados.includes(codigo);

    ramosMap[codigo] = {
      boton: ramo,
      prerequisitos,
      aprobado
    };

    // Marcar como aprobado si está en storage
    if (aprobado) {
      ramo.classList.add("aprobado");
      ramo.disabled = true;
    }
  });

  // Verifica si todos los ramos están aprobados (para "ALL")
  const checkAllAprobados = () =>
    Object.values(ramosMap).every(r => r.aprobado);

  // Habilita los ramos que cumplen sus prerequisitos
  const actualizarDesbloqueos = () => {
    for (const [codigo, data] of Object.entries(ramosMap)) {
      if (!data.aprobado) {
        const cumplidos = data.prerrequisitos.every(pr =>
          pr === "ALL" ? checkAllAprobados() : ramosMap[pr]?.aprobado
        );

        if (cumplidos) {
          data.boton.disabled = false;
        } else {
          data.boton.disabled = true;
        }
      }
    }
  };

  actualizarDesbloqueos();

  // Evento al hacer clic en un ramo
  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const codigo = ramo.dataset.codigo;
      const data = ramosMap[codigo];

      if (!data.aprobado) {
        data.aprobado = true;
        data.boton.classList.add("aprobado");
        data.boton.disabled = true;

        // Guardar en localStorage
        const nuevosAprobados = Object.entries(ramosMap)
          .filter(([, d]) => d.aprobado)
          .map(([codigo]) => codigo);

        localStorage.setItem("aprobados", JSON.stringify(nuevosAprobados));

        // Actualizar siguientes desbloqueos
        actualizarDesbloqueos();
      }
    });
  });
});

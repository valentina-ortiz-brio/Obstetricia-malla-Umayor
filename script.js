document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");
  const ramosMap = {};

  // Recuperar aprobados del almacenamiento
  const aprobadosGuardados = JSON.parse(localStorage.getItem("aprobados") || "[]");

  ramos.forEach(ramo => {
    const codigo = ramo.dataset.codigo;
    const prerequisitos = ramo.dataset.prerrequisitos
      ? ramo.dataset.prerrequisitos.split(" ").filter(Boolean)
      : [];

    const aprobado = aprobadosGuardados.includes(codigo);
    ramosMap[codigo] = { boton: ramo, prerequisitos, aprobado };

    if (aprobado) {
      ramo.classList.add("aprobado");
      ramo.disabled = true;
    } else if (prerequisitos.length > 0 && !prerequisitos.includes("ALL")) {
      ramo.disabled = true;
    }
  });

  const checkAllAprobados = () =>
    Object.values(ramosMap).every(r => r.aprobado);

  const actualizarDesbloqueos = () => {
    for (const [codigo, data] of Object.entries(ramosMap)) {
      if (!data.aprobado) {
        const cumplidos = data.prerrequisitos.every(
          pr => ramosMap[pr]?.aprobado
        );
        if (
          cumplidos ||
          (data.prerrequisitos.includes("ALL") && checkAllAprobados())
        ) {
          data.boton.disabled = false;
        }
      }
    }
  };

  actualizarDesbloqueos();

  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const codigo = ramo.dataset.codigo;
      const data = ramosMap[codigo];

      if (!data.aprobado) {
        data.aprobado = true;
        data.boton.classList.add("aprobado");
        data.boton.disabled = true;

        const nuevosAprobados = Object.entries(ramosMap)
          .filter(([, d]) => d.aprobado)
          .map(([codigo]) => codigo);

        localStorage.setItem("aprobados", JSON.stringify(nuevosAprobados));
        actualizarDesbloqueos();
      }
    });
  });
});

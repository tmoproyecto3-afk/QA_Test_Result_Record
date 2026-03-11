document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("testForm");
    const resultado = document.getElementById("resultado");

    // Campos dinámicos
    const documentoGroup = document.getElementById("documentoGroup");
    const documentoInput = document.getElementById("documento");
    const fileHelp = document.getElementById("fileHelp");

    const comentarioGroup = document.getElementById("comentarioGroup");
    const comentarioInput = document.getElementById("comentario");

    const impedimentoGroup = document.getElementById("impedimentoGroup");
    const impedimentoInput = document.getElementById("impedimento");

    const bugOptionsGroup = document.getElementById("bugOptionsGroup");
    const bugExistenteRadio = document.getElementById("bugExistenteRadio");
    const bugNuevoRadio = document.getElementById("bugNuevoRadio");
    const bugExistenteGroup = document.getElementById("bugExistenteGroup");
    const bugNuevoGroup = document.getElementById("bugNuevoGroup");
    const bugExistenteInput = document.getElementById("bugExistente");
    const bugTituloInput = document.getElementById("bugTitulo");
    const bugComentarioInput = document.getElementById("bugComentario");

    // Modal
    const modal = document.getElementById("confirmModal");
    const confirmSummary = document.getElementById("confirmSummary");
    const confirmSend = document.getElementById("confirmSend");
    const cancelSend = document.getElementById("cancelSend");

    // Botón
    const submitBtn = document.getElementById("submitBtn");
    const spinner = document.getElementById("spinner");
    const btnText = document.getElementById("btnText");

    // Reiniciar todos los campos dinámicos
    function resetDynamicFields() {
        documentoGroup.classList.add("hidden");
        comentarioGroup.classList.add("hidden");
        impedimentoGroup.classList.add("hidden");
        bugOptionsGroup.classList.add("hidden");
        bugExistenteGroup.classList.add("hidden");
        bugNuevoGroup.classList.add("hidden");

        documentoInput.required = false;
        comentarioInput.required = false;
        impedimentoInput.required = false;
        bugExistenteInput.required = false;
        bugTituloInput.required = false;
        bugComentarioInput.required = false;

        documentoInput.value = "";
        comentarioInput.value = "";
        impedimentoInput.value = "";
        bugExistenteInput.value = "";
        bugTituloInput.value = "";
        bugComentarioInput.value = "";

        fileHelp.textContent = "";
    }

    // Función para mostrar grupo de bug según radio
    function showBugGroup(type) {
        if (type === 'existente') {
            bugExistenteGroup.classList.remove("hidden");
            bugExistenteInput.required = true;

            bugNuevoGroup.classList.add("hidden");
            bugTituloInput.required = false;
            bugComentarioInput.required = false;
            bugTituloInput.value = "";
            bugComentarioInput.value = "";
        } else if (type === 'nuevo') {
            bugNuevoGroup.classList.remove("hidden");
            bugTituloInput.required = true;
            bugComentarioInput.required = true;

            bugExistenteGroup.classList.add("hidden");
            bugExistenteInput.required = false;
            bugExistenteInput.value = "";
        }
    }

    // Mostrar campos según resultado
    resultado.addEventListener("change", function () {
        resetDynamicFields();

        switch (this.value) {
            case "Exitoso":
                documentoGroup.classList.remove("hidden");
                documentoInput.required = true;
                documentoInput.accept = ".pdf";
                fileHelp.textContent = "Solo se permite archivo PDF.";
                break;

            case "Fallido":
                documentoGroup.classList.remove("hidden");
                bugOptionsGroup.classList.remove("hidden");
                documentoInput.required = true;
                documentoInput.accept = ".pdf";
                fileHelp.textContent = "Solo se permite archivo PDF.";

                // Por defecto seleccionar Bug Existente
                bugExistenteRadio.checked = true;
                showBugGroup('existente');
                break;

            case "No aplicable":
                documentoGroup.classList.remove("hidden");
                comentarioGroup.classList.remove("hidden");
                documentoInput.required = true;
                comentarioInput.required = true;
                documentoInput.accept = ".pdf,.png,.jpg,.jpeg,.eml,.msg";
                fileHelp.textContent = "Permitido: PDF, JPG, PNG, EML, MSG.";
                break;

            case "Paused":
                comentarioGroup.classList.remove("hidden");
                comentarioInput.required = true;
                break;

            case "Bloqueado":
                impedimentoGroup.classList.remove("hidden");
                impedimentoInput.required = true;
                break;
        }
    });

    // Listeners para radio buttons
    bugExistenteRadio.addEventListener("change", function () {
        if (this.checked) showBugGroup('existente');
    });
    bugNuevoRadio.addEventListener("change", function () {
        if (this.checked) showBugGroup('nuevo');
    });

    // Submit
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Validación de radios si resultado es Fallido
        if (resultado.value === "Fallido" && !bugExistenteRadio.checked && !bugNuevoRadio.checked) {
            alert("Debe seleccionar una opción de Gestión de Bug.");
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Validación adicional para PDF
        if ((resultado.value === "Exitoso" || resultado.value === "Fallido") && documentoInput.files.length > 0) {
            const file = documentoInput.files[0];
            if (file.type !== "application/pdf") {
                alert("Solo se permite subir archivos PDF.");
                documentoInput.focus();
                return;
            }
        }

        // Construcción del resumen solo con campos diligenciados
        let summaryHTML = `<p><strong>ID:</strong> ${form.testcase.value}</p>`;
        summaryHTML += `<p><strong>Resultado:</strong> ${resultado.value}</p>`;
        summaryHTML += `<p><strong>Tester:</strong> ${form.tester.value}</p>`;

        if (documentoInput.files[0]) summaryHTML += `<p><strong>Archivo:</strong> ${documentoInput.files[0].name}</p>`;
        if (bugExistenteRadio.checked && bugExistenteInput.value) summaryHTML += `<p><strong>Bug Existente:</strong> ${bugExistenteInput.value}</p>`;
        if (bugNuevoRadio.checked && (bugTituloInput.value || bugComentarioInput.value)) {
            summaryHTML += `<p><strong>Nuevo Bug:</strong></p>`;
            if (bugTituloInput.value) summaryHTML += `<p><strong>Título:</strong> ${bugTituloInput.value}</p>`;
            if (bugComentarioInput.value) summaryHTML += `<p><strong>Comentario Bug:</strong> ${bugComentarioInput.value}</p>`;
        }
        if (comentarioInput.value) summaryHTML += `<p><strong>Comentario:</strong> ${comentarioInput.value}</p>`;
        if (impedimentoInput.value) summaryHTML += `<p><strong>ID Impedimento:</strong> ${impedimentoInput.value}</p>`;

        confirmSummary.innerHTML = summaryHTML;
        modal.classList.add("active");
    });

    cancelSend.addEventListener("click", function () {
        modal.classList.remove("active");
    });

    // Confirmar envío a n8n
    confirmSend.addEventListener("click", async function () {
        modal.classList.remove("active");

        spinner.classList.remove("hidden");
        btnText.textContent = "Procesando...";
        submitBtn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, { method: "POST", body: formData });
            if (!response.ok) throw new Error(`Error en el servidor: ${response.status}`);
            const data = await response.json();

            const params = new URLSearchParams();
            params.append("tipo", data.tipo || "error");
            let mensajeFinal = data.mensaje || "Operación finalizada";
            if (data.acciones && data.acciones.trim() !== "") mensajeFinal += `|${data.acciones}`;
            params.append("mensaje", mensajeFinal);

            window.location.href = `conf.html?${params.toString()}`;
        } catch (error) {
            console.error("Error crítico:", error);
            window.location.href = `conf.html?tipo=error&mensaje=No se pudo establecer conexión con el servidor de validación.`;
        } finally {
            spinner.classList.add("hidden");
            btnText.textContent = "Registrar Resultado";
            submitBtn.disabled = false;
        }
    });

});
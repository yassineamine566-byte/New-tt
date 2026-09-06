<script>
/* =========================================================
   HANSSWAG.QR — HIGH QUALITY EXPORT ENGINE
   لا يغير مولد QR الأصلي
========================================================= */

(function () {
    "use strict";

    const openBtn = document.getElementById("downloadPng");

    const preview = document.getElementById("hsqExportPreview");
    const closeBtn = document.getElementById("hsqCloseExport");

    const pngBtn = document.getElementById("hsqDownloadPNG");
    const svgBtn = document.getElementById("hsqDownloadSVG");
    const copyBtn = document.getElementById("hsqCopyImage");

    const exportQR = document.getElementById("hsqExportQR");
    const resolutionText = document.getElementById("hsqExportResolution");

    if (!openBtn || !preview || !exportQR) return;


    /* ---------------------------------------------------------
       Get current QR
    --------------------------------------------------------- */

    function getCurrentQR() {

        const canvas =
            document.querySelector("#qrcode canvas");

        if (!canvas) return null;

        return canvas;
    }


    /* ---------------------------------------------------------
       Get selected quality
    --------------------------------------------------------- */

    function getQuality() {

        const selector =
            document.getElementById("qrQuality");

        const value =
            Number(selector?.value || 2048);

        return Math.max(
            1024,
            Math.min(value, 4096)
        );
    }


    /* ---------------------------------------------------------
       Build ultra sharp export
    --------------------------------------------------------- */

    function buildExportCanvas() {

        const source = getCurrentQR();

        if (!source) {

            if (typeof showToast === "function") {
                showToast(
                    "Generate a QR code first.",
                    "fa-exclamation-circle"
                );
            }

            return null;
        }


        const size = getQuality();

        resolutionText.textContent =
            size + " × " + size;


        /*
         * Large canvas.
         * QR remains crisp.
         */

        const scale = size / 2048;

        const canvas =
            document.createElement("canvas");

        canvas.width = size;
        canvas.height =
            Math.round(size * 1.34);


        const ctx =
            canvas.getContext("2d", {
                alpha: false
            });


        if (!ctx) return null;


        ctx.imageSmoothingEnabled = false;


        /* -----------------------------------------------------
           Background
        ----------------------------------------------------- */

        const bg =
            ctx.createLinearGradient(
                0,
                0,
                size,
                canvas.height
            );

        bg.addColorStop(
            0,
            "#f8f7ff"
        );

        bg.addColorStop(
            1,
            "#e9f7ff"
        );

        ctx.fillStyle = bg;

        ctx.fillRect(
            0,
            0,
            size,
            canvas.height
        );


        /* -----------------------------------------------------
           Soft glow
        ----------------------------------------------------- */

        const glow =
            ctx.createRadialGradient(
                size * .5,
                size * .42,
                0,
                size * .5,
                size * .42,
                size * .55
            );

        glow.addColorStop(
            0,
            "rgba(139,109,240,.20)"
        );

        glow.addColorStop(
            1,
            "rgba(139,109,240,0)"
        );

        ctx.fillStyle = glow;

        ctx.fillRect(
            0,
            0,
            size,
            canvas.height
        );


        /* -----------------------------------------------------
           Main glass frame
        ----------------------------------------------------- */

        const frameX =
            Math.round(size * .07);

        const frameY =
            Math.round(size * .055);

        const frameW =
            Math.round(size * .86);

        const frameH =
            Math.round(size * .91);

        const radius =
            Math.round(size * .055);


        ctx.save();

        ctx.shadowColor =
            "rgba(40,25,90,.20)";

        ctx.shadowBlur =
            Math.round(size * .035);

        ctx.shadowOffsetY =
            Math.round(size * .012);


        roundedRect(
            ctx,
            frameX,
            frameY,
            frameW,
            frameH,
            radius
        );


        ctx.fillStyle =
            "rgba(255,255,255,.48)";

        ctx.fill();

        ctx.restore();


        /* -----------------------------------------------------
           QR white plate
        ----------------------------------------------------- */

        const qrSize =
            Math.round(size * .70);

        const qrX =
            Math.round(
                (size - qrSize) / 2
            );

        const qrY =
            Math.round(size * .10);


        ctx.save();

        ctx.shadowColor =
            "rgba(30,20,70,.18)";

        ctx.shadowBlur =
            Math.round(size * .022);


        roundedRect(
            ctx,
            qrX,
            qrY,
            qrSize,
            qrSize,
            Math.round(size * .045)
        );


        ctx.fillStyle = "#ffffff";

        ctx.fill();

        ctx.restore();


        /* -----------------------------------------------------
           CRISP QR
        ----------------------------------------------------- */

        ctx.save();

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            source,
            qrX,
            qrY,
            qrSize,
            qrSize
        );

        ctx.restore();


        /* -----------------------------------------------------
           Brand rectangle
        ----------------------------------------------------- */

        const brandY =
            qrY +
            qrSize +
            Math.round(size * .045);

        const brandH =
            Math.round(size * .135);


        ctx.save();


        roundedRect(
            ctx,
            qrX,
            brandY,
            qrSize,
            brandH,
            Math.round(size * .032)
        );


        const brandGradient =
            ctx.createLinearGradient(
                qrX,
                brandY,
                qrX + qrSize,
                brandY + brandH
            );

        brandGradient.addColorStop(
            0,
            "#171320"
        );

        brandGradient.addColorStop(
            1,
            "#302541"
        );


        ctx.fillStyle =
            brandGradient;

        ctx.fill();


        ctx.strokeStyle =
            "rgba(255,255,255,.18)";

        ctx.lineWidth =
            Math.max(
                2,
                Math.round(size / 700)
            );

        ctx.stroke();


        /* Website */

        ctx.fillStyle =
            "#ffffff";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.font =
            "700 " +
            Math.round(size * .030) +
            "px Segoe UI, Arial, sans-serif";


        ctx.fillText(
            "https://hansswagQR.com",
            size / 2,
            brandY + brandH * .40
        );


        /* Subtitle */

        ctx.fillStyle =
            "rgba(255,255,255,.62)";


        ctx.font =
            "500 " +
            Math.round(size * .017) +
            "px Segoe UI, Arial, sans-serif";


        ctx.fillText(
            "Scan • Create • Share • Hansswag.QR",
            size / 2,
            brandY + brandH * .72
        );


        ctx.restore();


        /* -----------------------------------------------------
           Bottom quality information
        ----------------------------------------------------- */

        ctx.fillStyle =
            "rgba(35,25,65,.52)";

        ctx.font =
            "600 " +
            Math.round(size * .013) +
            "px Segoe UI, Arial, sans-serif";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "HIGH QUALITY • ERROR CORRECTION H • SCAN SAFE",
            size / 2,
            canvas.height -
            Math.round(size * .035)
        );


        return canvas;
    }


    /* ---------------------------------------------------------
       Rounded rectangle helper
    --------------------------------------------------------- */

    function roundedRect(
        ctx,
        x,
        y,
        w,
        h,
        r
    ) {

        r = Math.min(
            r,
            w / 2,
            h / 2
        );

        ctx.beginPath();

        ctx.moveTo(
            x + r,
            y
        );

        ctx.arcTo(
            x + w,
            y,
            x + w,
            y + h,
            r
        );

        ctx.arcTo(
            x + w,
            y + h,
            x,
            y + h,
            r
        );

        ctx.arcTo(
            x,
            y + h,
            x,
            y,
            r
        );

        ctx.arcTo(
            x,
            y,
            x + w,
            y,
            r
        );

        ctx.closePath();
    }


    /* ---------------------------------------------------------
       Create Blob
    --------------------------------------------------------- */

    function canvasBlob(canvas) {

        return new Promise(resolve => {

            canvas.toBlob(
                blob => resolve(blob),
                "image/png",
                1
            );

        });
    }


    /* ---------------------------------------------------------
       Download
    --------------------------------------------------------- */

    async function downloadPNG() {

        const canvas =
            buildExportCanvas();

        if (!canvas) return;


        const blob =
            await canvasBlob(canvas);


        if (!blob) return;


        const url =
            URL.createObjectURL(blob);


        const a =
            document.createElement("a");


        a.href = url;

        a.download =
            "hansswagQR-" +
            getQuality() +
            "px.png";


        document.body.appendChild(a);

        a.click();

        a.remove();


        setTimeout(
            () => URL.revokeObjectURL(url),
            1500
        );


        if (typeof showToast === "function") {

            showToast(
                "Ultra HD PNG downloaded!",
                "fa-check-circle"
            );

        }
    }


    /* ---------------------------------------------------------
       SVG
       --------------------------------------------------------- */

    async function downloadSVG() {

        const canvas =
            buildExportCanvas();

        if (!canvas) return;


        const blob =
            await canvasBlob(canvas);


        if (!blob) return;


        const reader =
            new FileReader();


        reader.onload = function () {

            const svg =
                `<svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="${canvas.width}"
                    height="${canvas.height}"
                    viewBox="0 0 ${canvas.width} ${canvas.height}">
                    <image
                        href="${reader.result}"
                        width="${canvas.width}"
                        height="${canvas.height}"
                        preserveAspectRatio="none"/>
                </svg>`;


            const svgBlob =
                new Blob(
                    [svg],
                    {
                        type:
                            "image/svg+xml"
                    }
                );


            const url =
                URL.createObjectURL(svgBlob);


            const a =
                document.createElement("a");


            a.href = url;

            a.download =
                "hansswagQR.svg";


            document.body.appendChild(a);

            a.click();

            a.remove();


            setTimeout(
                () => URL.revokeObjectURL(url),
                1500
            );


            if (typeof showToast === "function") {

                showToast(
                    "SVG downloaded!",
                    "fa-check-circle"
                );

            }
        };


        reader.readAsDataURL(blob);
    }


    /* ---------------------------------------------------------
       Copy image
    --------------------------------------------------------- */

    async function copyImage() {

        const canvas =
            buildExportCanvas();

        if (!canvas) return;


        const blob =
            await canvasBlob(canvas);


        if (!blob) return;


        try {

            await navigator.clipboard.write([
                new ClipboardItem({
                    "image/png": blob
                })
            ]);


            if (typeof showToast === "function") {

                showToast(
                    "QR image copied!",
                    "fa-copy"
                );

            }

        } catch (error) {

            if (typeof showToast === "function") {

                showToast(
                    "Copy is not supported here.",
                    "fa-exclamation-circle"
                );

            }

        }
    }


    /* ---------------------------------------------------------
       Open preview
    --------------------------------------------------------- */

    function openPreview() {

        const source =
            getCurrentQR();

        if (!source) {

            if (typeof showToast === "function") {

                showToast(
                    "Generate a QR code first.",
                    "fa-exclamation-circle"
                );

            }

            return;
        }


        const canvas =
            buildExportCanvas();


        if (!canvas) return;


        exportQR.innerHTML = "";

        exportQR.appendChild(
            canvas
        );


        preview.classList.add("open");

        preview.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    /* ---------------------------------------------------------
       Close
    --------------------------------------------------------- */

    function closePreview() {

        preview.classList.remove("open");

        preview.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    /* ---------------------------------------------------------
       Events
    --------------------------------------------------------- */

    /*
     * Replace only the PNG button's old click action.
     * Everything else in the website stays untouched.
     */

    const newOpenBtn =
        openBtn.cloneNode(true);

    openBtn.replaceWith(newOpenBtn);


    newOpenBtn.addEventListener(
        "click",
        openPreview
    );


    closeBtn.addEventListener(
        "click",
        closePreview
    );


    pngBtn.addEventListener(
        "click",
        downloadPNG
    );


    svgBtn.addEventListener(
        "click",
        downloadSVG
    );


    copyBtn.addEventListener(
        "click",
        copyImage
    );


    preview.addEventListener(
        "click",
        function (e) {

            if (e.target === preview) {
                closePreview();
            }

        }
    );


    document.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key === "Escape" &&
                preview.classList.contains("open")
            ) {
                closePreview();
            }

        }
    );

})();
</script>

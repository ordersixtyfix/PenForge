document.addEventListener("DOMContentLoaded", (event) => {
    let dragged;

    // Setup drag functionality for tools
    document
        .querySelectorAll(".draggable-1, .draggable-2, .draggable-3")
        .forEach((elem) => {
            elem.setAttribute("draggable", true);

            elem.addEventListener("dragstart", function (event) {
                dragged = event.target;
                event.target.style.opacity = 0.5; // Visual feedback
            });

            elem.addEventListener("dragend", function (event) {
                event.target.style.opacity = ""; // Reset opacity
            });
        });

    // Setup drop zones in categories
    document.querySelectorAll(".category").forEach((category) => {
        category.addEventListener("dragover", function (event) {
            event.preventDefault(); // Allow dropping
        });

        category.addEventListener("drop", function (event) {
            event.preventDefault();
            if (dragged) {
                // Check if the category already has an element, if so, do not add
                if (!category.querySelector(`#${dragged.id}`)) {
                    category.appendChild(dragged);
                }
            }
        });

        category.addEventListener("dragenter", function (event) {
            event.target.style.background = "#a0a"; // Highlight
        });

        category.addEventListener("dragleave", function (event) {
            event.target.style.background = ""; // Remove highlight
        });
    });

    // Setup tool visibility toggles
    const filterButtons = {
        green: document.querySelector(".tools-green-box"),
        yellow: document.querySelector(".tools-yellow-box"),
        red: document.querySelector(".tools-red-box"),
        all: document.querySelector(".tools-all-box"),
    };

    const tools = {
        green: document.querySelectorAll(".draggable-1"),
        yellow: document.querySelectorAll(".draggable-2"),
        red: document.querySelectorAll(".draggable-3"),
        all: document.querySelectorAll(".draggable-1, .draggable-2, .draggable-3"),
    };

    const displayTools = (color) => {

        if (color === "all") {
            tools.all.forEach((tool) => {
                tool.style.display = "block";
            });
        } else {
            ["green", "yellow", "red"].forEach((c) => {
                tools[c].forEach((tool) => {
                    tool.style.display = c === color ? "block" : "none";
                });
            });
        }
    };



    filterButtons.green.addEventListener("click", () => displayTools("green"));
    filterButtons.yellow.addEventListener("click", () => displayTools("yellow"));
    filterButtons.red.addEventListener("click", () => displayTools("red"));
    filterButtons.all.addEventListener("click", () => displayTools("all"));

    // Tooltips for tools
    document.querySelectorAll('.draggable-1, .draggable-2, .draggable-3').forEach((tool) => {
        tool.addEventListener('mouseenter', function(event) {
            const tooltipText = event.target.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.display = 'block';
            tooltip.style.position = 'absolute';
            tooltip.style.left = '0';
            tooltip.style.top = '0';
            tooltip.style.width = '100%'; // Tooltip width matches the tool width
            tooltip.style.textAlign = 'center'; // Center the text inside the tooltip
            event.target.style.position = 'relative'; // This is crucial for correct tooltip positioning
            event.target.appendChild(tooltip);
        });

        tool.addEventListener('mouseleave', function(event) {
            const tooltip = event.target.querySelector('.tooltip');
            if (tooltip) {
                event.target.removeChild(tooltip);
            }
        });
    });


});
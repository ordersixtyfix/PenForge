const COLORS = {
    GREEN: 'green',
    YELLOW: 'yellow',
    RED: 'red'
};

const COLOR_MEANINGS = {
    [COLORS.GREEN]: 'recon',
    [COLORS.YELLOW]: 'discovery',
    [COLORS.RED]: 'exploitation'
};

class DragAndDropManager {
    constructor() {
        this.dragged = null;
        this.tools = [
            { id: 'Nmap', name: 'Nmap', tooltip: 'Nmap is a network scanning tool.', color: COLORS.GREEN },
            { id: 'Masscan', name: 'Masscan', tooltip: 'Masscan is a fast password cracking tool.', color: COLORS.GREEN },
            { id: 'Shodan', name: 'Shodan', tooltip: 'Shodan is a fast password cracking tool.', color: COLORS.GREEN },
            { id: 'Amass', name: 'Amass', tooltip: 'Amass is a fast password cracking tool.', color: COLORS.GREEN },
            { id: 'Nikto', name: 'Nikto', tooltip: 'Nikto is a fast password cracking tool.', color: COLORS.YELLOW },
            { id: 'WPScan', name: 'WPScan', tooltip: 'WPScan is a fast password cracking tool.', color: COLORS.YELLOW },
            { id: 'Burp Suite', name: 'Burp Suite', tooltip: 'Burp Suite is a fast password cracking tool.', color: COLORS.YELLOW },
            { id: 'Enum4linux', name: 'Enum4linux', tooltip: 'Enum4linux is a fast password cracking tool.', color: COLORS.YELLOW },
            { id: 'SMBMap', name: 'SMBMap', tooltip: 'SMBMap is a fast password cracking tool.', color: COLORS.YELLOW },
            { id: 'SNMPWalk', name: 'SNMPWalk', tooltip: 'SNMPWalk is a fast password cracking tool.', color: COLORS.RED },
            { id: 'Metasploit Framework', name: 'Metasploit Framework', tooltip: 'Metasploit Framework is a fast password cracking tool.', color: COLORS.RED },
            { id: 'SQLMap', name: 'SQLMap', tooltip: 'SQLMap is a fast password cracking tool.', color: COLORS.RED },
            { id: 'Hydra', name: 'Hydra', tooltip: 'Hydra is a fast password cracking tool.', color: COLORS.RED },
            { id: 'Mimikatz', name: 'Mimikatz', tooltip: 'Mimikatz is a fast password cracking tool.', color: COLORS.RED },
            { id: 'Responder', name: 'Responder', tooltip: 'Responder is a fast password cracking tool.', color: COLORS.RED },
            { id: 'PowerSploit', name: 'PowerSploit', tooltip: 'PowerSploit is a fast password cracking tool.', color: COLORS.RED },
            { id: 'umit', name: 'umit', tooltip: 'umit is a fast password cracking tool.', color: COLORS.RED },
            { id: 'kutay', name: 'kutay', tooltip: 'kutay is a fast password cracking tool.', color: COLORS.RED }
        ];
        this.templates = [
            {
                name: "Test Attack Template",
                tools: ['Nmap', 'Nikto', 'Hydra']
            },
            {
                name: "Test Attack Template 2",
                tools: ['Nmap', 'Nikto', 'Hydra', 'WPScan', 'Mimikatz']
            },
            {
                name: "Test Attack Template 3",
                tools: ['Amass', 'Nikto', 'Hydra', 'WPScan', 'Mimikatz']
            }
        ];
        this.setupDraggableElements();
        this.setupDropZones();
        this.setupToolVisibilityToggles();
        this.setupTooltips();
        this.renderTemplates();
    }

    setupDraggableElements() {
        const toolsPanel = document.querySelector('.tools-panel');
        this.tools.forEach(tool => {
            const toolDiv = this.createToolElement(tool);
            toolsPanel.appendChild(toolDiv);
        });
    }

    createToolElement(tool) {
        const toolDiv = document.createElement('div');
        toolDiv.className = this.getDraggableClass(tool.color);
        toolDiv.id = tool.id;
        toolDiv.dataset.tooltip = tool.tooltip;
        toolDiv.textContent = tool.name;
        toolDiv.setAttribute('draggable', true);
        toolDiv.addEventListener('dragstart', this.handleDragStart.bind(this));
        toolDiv.addEventListener('dragend', this.handleDragEnd);
        toolDiv.addEventListener('click', this.handleItemClick.bind(this, toolDiv));
        return toolDiv;
    }

    getDraggableClass(color) {
        switch (color) {
            case COLORS.GREEN:
                return 'draggable-1';
            case COLORS.YELLOW:
                return 'draggable-2';
            case COLORS.RED:
                return 'draggable-3';
            default:
                return '';
        }
    }

    handleDragStart(event) {
        this.dragged = event.target;
        event.target.style.opacity = 0.5;
    }

    handleDragEnd(event) {
        event.target.style.opacity = "";
    }

    handleItemClick(item) {
        const parentCategory = item.parentElement;
        if (parentCategory.classList.contains("category")) {
            const toolsPanel = document.querySelector(".tools-panel");
            toolsPanel.appendChild(item);
        }
    }

    setupDropZones() {
        const categories = document.querySelectorAll(".category");
        categories.forEach((category) => {
            category.addEventListener("dragover", this.handleDragOver);
            category.addEventListener("drop", this.handleDrop.bind(this, category));
        });
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(category, event) {
        event.preventDefault();
        if (this.dragged) {
            const draggedId = this.dragged.id;
            if (!category.querySelector(`#${draggedId}`)) {
                if (this.checkDropValidity(category, this.dragged)) {
                    category.classList.add("animate-tool-drop");
                    category.appendChild(this.dragged);

                    const templateIndex = this.templates.findIndex(template => template.name === category.textContent.trim());
                    if (templateIndex !== -1) {
                        this.templates[templateIndex].tools.push(this.dragged.textContent.trim());
                    }

                    setTimeout(() => {
                        category.classList.remove("animate-tool-drop");
                    }, 1000);
                }
            }
        }
    }

    checkDropValidity(category, dragged) {
        const categoryId = category.getAttribute("data-category-id");
        const draggedColor = this.getDraggedColor(dragged);
        return categoryId === COLOR_MEANINGS[draggedColor];
    }

    getDraggedColor(dragged) {
        return dragged.classList.contains("draggable-1")
            ? COLORS.GREEN
            : dragged.classList.contains("draggable-2")
                ? COLORS.YELLOW
                : COLORS.RED;
    }

    setupToolVisibilityToggles() {
        const filterButtons = {
            green: document.querySelector(".tools-red-box"),
            yellow: document.querySelector(".tools-yellow-box"),
            red: document.querySelector(".tools-green-box"),
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
                [COLORS.GREEN, COLORS.YELLOW, COLORS.RED].forEach((c) => {
                    tools[c].forEach((tool) => {
                        tool.style.display = c === color ? "block" : "none";
                    });
                });
            }
        };

        filterButtons.green.addEventListener("click", () => displayTools(COLORS.GREEN));
        filterButtons.yellow.addEventListener("click", () => displayTools(COLORS.YELLOW));
        filterButtons.red.addEventListener("click", () => displayTools(COLORS.RED));
        filterButtons.all.addEventListener("click", () => displayTools("all"));
    }

    setupTooltips() {
        const tooltipHandler = (event) => {
            const tooltipText = event.target.getAttribute("data-tooltip");
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.textContent = tooltipText;
            tooltip.style.display = "block";
            tooltip.style.position = "absolute";
            tooltip.style.left = "0";
            tooltip.style.top = "0";
            tooltip.style.width = "100%";
            tooltip.style.textAlign = "center";
            event.target.style.position = "relative";
            event.target.appendChild(tooltip);

            event.target.addEventListener("mouseleave", function removeTooltip() {
                event.target.removeChild(tooltip);
                event.target.removeEventListener("mouseleave", removeTooltip);
            });
        };

        const toolElements = document.querySelectorAll('.draggable-1, .draggable-2, .draggable-3');
        toolElements.forEach((tool) => {
            tool.addEventListener("mouseenter", tooltipHandler);
        });
    }

    renderTemplates() {
        const templatesPanel = document.querySelector(".attack-templates-panel");
        this.templates.forEach((template) => {
            const templateDiv = document.createElement("div");
            templateDiv.classList.add("template");
            templateDiv.textContent = template.name;
            templateDiv.addEventListener("click", () => this.handleTemplateClick(template));
            templatesPanel.appendChild(templateDiv);
        });
    }

    handleTemplateClick(template) {
        const categories = document.querySelectorAll(".category");
        categories.forEach(category => {
            while (category.firstChild) {
                category.removeChild(category.firstChild);
            }
        });

        template.tools.forEach(toolName => {
            const tool = this.tools.find(tool => tool.name === toolName);
            if (tool) {
                const toolDiv = this.createToolElement(tool);
                const category = document.querySelector(`[data-category-id="${COLOR_MEANINGS[tool.color]}"]`);
                category.appendChild(toolDiv);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new DragAndDropManager();
});
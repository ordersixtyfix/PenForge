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
        this.toolVisibility = "all";
        this.tools = [
            { id: 'Nmap', name: 'Nmap', tooltip: 'Nmap is a network scanning tool.', color: COLORS.GREEN, position: 0 },
            { id: 'Masscan', name: 'Masscan', tooltip: 'Masscan is a fast network scanner.', color: COLORS.GREEN, position: 1 },
            { id: 'Shodan', name: 'Shodan', tooltip: 'Shodan is a search engine for Internet-connected devices.', color: COLORS.GREEN, position: 2 },
            { id: 'Amass', name: 'Amass', tooltip: 'Amass is a tool for in-depth DNS enumeration.', color: COLORS.GREEN, position: 3 },
            { id: 'Nikto', name: 'Nikto', tooltip: 'Nikto is a web server vulnerability scanner.', color: COLORS.YELLOW, position: 4 },
            { id: 'WPScan', name: 'WPScan', tooltip: 'WPScan is a WordPress vulnerability scanner.', color: COLORS.YELLOW, position: 5 },
            { id: 'Burp Suite', name: 'Burp Suite', tooltip: 'Burp Suite is a web vulnerability scanner and testing tool.', color: COLORS.YELLOW, position: 6 },
            { id: 'Enum4linux', name: 'Enum4linux', tooltip: 'Enum4linux is a Linux tool for enumerating information from Windows and Samba systems.', color: COLORS.YELLOW, position: 7 },
            { id: 'SMBMap', name: 'SMBMap', tooltip: 'SMBMap is a tool for assessing the security of SMB shares.', color: COLORS.YELLOW, position: 8 },
            { id: 'SNMPWalk', name: 'SNMPWalk', tooltip: 'SNMPWalk is a tool for querying network devices via SNMP.', color: COLORS.RED, position: 9 },
            { id: 'Metasploit Framework', name: 'Metasploit Framework', tooltip: 'Metasploit Framework is a tool for developing and executing exploit code against a remote target machine.', color: COLORS.RED, position: 10 },
            { id: 'SQLMap', name: 'SQLMap', tooltip: 'SQLMap is a tool for automating the detection and exploitation of SQL injection flaws.', color: COLORS.RED, position: 11 },
            { id: 'Hydra', name: 'Hydra', tooltip: 'Hydra is a parallelized login cracker which supports numerous protocols to attack.', color: COLORS.RED, position: 12 },
            { id: 'Mimikatz', name: 'Mimikatz', tooltip: 'Mimikatz is a tool to gather credentials and perform credential-related attacks on Windows.', color: COLORS.RED, position: 13 },
            { id: 'Responder', name: 'Responder', tooltip: 'Responder is a tool for LLMNR, NBT-NS, and MDNS poisoning attacks.', color: COLORS.RED, position: 14 },
            { id: 'PowerSploit', name: 'PowerSploit', tooltip: 'PowerSploit is a collection of PowerShell scripts for post-exploitation.', color: COLORS.RED, position: 15 },
            { id: 'Netcat', name: 'Netcat', tooltip: 'Netcat is a networking utility for reading from and writing to network connections.', color: COLORS.RED, position: 16 }
        ];
        this.templates = [
            {
                name: "Ftp Brute Force Attack Template",
                tools: ['Nmap', '', 'Hydra']
            },
            {
                name: "Ssh Brute Force Attack Template",
                tools: ['Nmap', '', 'Metasploit Framework']
            },
            {
                name: "BindShell Access Template",
                tools: ['Amass', '', 'Netcat']
            }
        ];
        this.selectedTemplate = null;

        this.setupDraggableElements();
        this.setupDropZones();
        this.setupToolVisibilityToggles(this.toolVisibility);
        this.setupTooltips();
        this.renderTemplates();
    }

    setupDraggableElements() {
        const toolsPanel = document.querySelector('.left-panel');

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
        toolDiv.style.order = tool.position;

        toolDiv.setAttribute('draggable', true);
        toolDiv.addEventListener('dragstart', this.handleDragStart.bind(this));
        toolDiv.addEventListener('dragend', this.handleDragEnd);
        toolDiv.addEventListener('click', this.handleItemLeftClick.bind(this, toolDiv));
        toolDiv.addEventListener('contextmenu', this.handleItemRightClick.bind(this, toolDiv));
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

    handleItemLeftClick(item, event) {
        event.preventDefault();

        const parentCategory = item.parentElement;

        if (parentCategory.classList.contains("top-box")) {
            let toolInput = item.querySelector("input");

            if (toolInput) {
                toolInput.style.display = "inline-block";
                toolInput.focus();
                return;
            }

            const container = document.createElement("div");
            const input = document.createElement("input");

            input.type = "text";
            input.style.display = "inline-block";

            const spanContainer = document.createElement("div");

            spanContainer.style.marginTop = "6px";
            spanContainer.style.display = "flex";
            spanContainer.style.alignItems = "center";
            spanContainer.style.justifyContent = "space-around";
            spanContainer.style.flexWrap = "wrap";

            container.appendChild(input);
            container.appendChild(spanContainer);
            item.appendChild(container);

            input.focus();

            input.addEventListener("blur", () => {
                input.style.display = "none";
            });

            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    const value = input.value.trim();

                    if (value !== "") {
                        const span = document.createElement("span");

                        span.style.margin = "6px";
                        span.style.padding = "8px";
                        span.style.backgroundColor = "#34495E";
                        span.style.borderRadius = "8px";
                        span.style.animation = "toolAppear 0.2s ease-in-out";

                        const img = document.createElement("img");

                        img.src = "../../assets/icons/plus.png";
                        img.width = 24;
                        img.height = 24;
                        img.style.marginRight = "6px";
                        img.style.verticalAlign = "middle";

                        const textNode = document.createTextNode(value);

                        span.appendChild(img);
                        span.appendChild(textNode);
                        spanContainer.appendChild(span);
                        input.value = "";
                    }
                }
            });
        }
    }

    handleItemRightClick(item, event) {
        event.preventDefault();

        if (this.selectedTemplate !== null) {
            return;
        }

        const parentCategory = item.parentElement;

        if (parentCategory.classList.contains("top-box")) {
            const toolsPanel = document.querySelector(".left-panel");
            const tool = this.tools.find(t => t.id === item.id);

            const text = item.textContent.trim();
            if (!toolsPanel.textContent.includes(text)) {
                const img = item.querySelector("img");

                if (img) {
                    img.parentNode.removeChild(img);
                }

                item.style.order = tool.position;
                toolsPanel.appendChild(item);
            }

            parentCategory.removeChild(item);

            const input = item.querySelector("input");

            if (input) {
                input.style.display = "none";
            }

            this.setupToolVisibilityToggles(this.toolVisibility);
        }
    }

    setupDropZones() {
        const categories = document.querySelectorAll(".top-box");

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

                    if (!this.dragged.querySelector('img') || !this.dragged.querySelector('img').src.includes("click")) {
                        const img = document.createElement("img");

                        img.src = "../../assets/icons/click.png";
                        img.width = 24;
                        img.height = 24;

                        img.style.marginRight = "5px";

                        img.style.marginRight = "6px";

                        img.style.verticalAlign = "middle";

                        this.dragged.insertBefore(img, this.dragged.firstChild);
                    }

                    category.appendChild(this.dragged);

                    const templateIndex = this.templates.findIndex(template => template.name === category.textContent.trim());

                    if (templateIndex !== -1) {
                        this.templates[templateIndex].tools.push(this.dragged.textContent.trim());
                    }

                    // draggedId

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

    setupToolVisibilityToggles(color) {
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

        if (color === "all") {
            tools.all.forEach((tool) => {
                tool.style.display = "block";
            });
        } else {
            [COLORS.GREEN, COLORS.YELLOW, COLORS.RED].forEach((c) => {
                tools[c].forEach((tool) => {
                    if (!tool.closest('.top-box')) {
                        tool.style.display = c === color ? "block" : "none";
                    }
                });
            });
        }

        this.toolVisibility = color;

        if (!filterButtons.green.classList.contains('listener-added')) {
            filterButtons.green.addEventListener("click", () => this.setupToolVisibilityToggles(COLORS.GREEN));
            filterButtons.green.classList.add('listener-added');
        }
        if (!filterButtons.yellow.classList.contains('listener-added')) {
            filterButtons.yellow.addEventListener("click", () => this.setupToolVisibilityToggles(COLORS.YELLOW));
            filterButtons.yellow.classList.add('listener-added');
        }
        if (!filterButtons.red.classList.contains('listener-added')) {
            filterButtons.red.addEventListener("click", () => this.setupToolVisibilityToggles(COLORS.RED));
            filterButtons.red.classList.add('listener-added');
        }
        if (!filterButtons.all.classList.contains('listener-added')) {
            filterButtons.all.addEventListener("click", () => this.setupToolVisibilityToggles("all"));
            filterButtons.all.classList.add('listener-added');
        }
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
        const templatesPanel = document.querySelector(".bottom-box-container");

        this.templates.forEach((template) => {
            const templateDiv = document.createElement("div");

            templateDiv.classList.add("bottom-box");

            const img = document.createElement("img");

            img.src = "../../assets/icons/click.png";
            img.width = 24;
            img.height = 24;
            img.style.marginRight = "5px";

            img.style.marginRight = "6px";

            img.style.verticalAlign = "middle";
            templateDiv.appendChild(img);

            const templateName = document.createElement("span");

            templateName.textContent = template.name;
            templateDiv.appendChild(templateName);

            templateDiv.addEventListener("click", () => this.handleTemplateClick(template, templateDiv));

            templatesPanel.appendChild(templateDiv);
        });
    }


    handleTemplateClick(template, templateDiv) {
        this.cleanCategories();
        this.selectedTemplate = template.name;

        const toolsPanel = document.querySelector(".left-panel");

        toolsPanel.classList.add('not-clickable');

        templateDiv.classList.add("animate-tool-drop");
        template.tools.forEach(toolName => {
            const tool = this.tools.find(tool => tool.name === toolName);

            if (tool) {
                const toolDiv = this.createToolElement(tool);

                if (!toolDiv.querySelector('img')) {
                    const img = document.createElement("img");

                    img.src = "../../assets/icons/click.png";
                    img.width = 24;
                    img.height = 24;
                    img.style.marginRight = "6px";

                    toolDiv.insertBefore(img, toolDiv.firstChild);
                }

                const category = document.querySelector(`[data-category-id="${COLOR_MEANINGS[tool.color]}"]`);
                category.appendChild(toolDiv);
            }
        });

        setTimeout(() => {
            templateDiv.classList.remove("animate-tool-drop");
        }, 1000);
    }

    cleanCategories() {
        if (this.selectedTemplate !== null) {
            this.selectedTemplate = null;
        }

        const categories = document.querySelectorAll(".top-box");
        const toolsPanel = document.querySelector(".left-panel");

        if (toolsPanel.classList.contains('not-clickable')) {
            toolsPanel.classList.remove('not-clickable');
        }

        categories.forEach(category => {
            const children = category.children;

            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];

                if (child.tagName !== "IMG" && child.tagName !== "SPAN") {
                    const img = child.querySelector('img');

                    if (img && img.src.includes("click") && img.parentNode === child) {
                        child.removeChild(img);
                    }

                    child.parentNode.removeChild(child);

                    const text = child.textContent.trim();

                    if (!toolsPanel.textContent.includes(text)) {
                        toolsPanel.appendChild(child);
                    }
                }
            }
        });

        this.setupToolVisibilityToggles(this.toolVisibility);
    }

    showAlert(message) {
        const alertElement = document.getElementById('custom-alert');
        const messageElement = document.getElementById('custom-alert-message');

        messageElement.innerHTML = message;
        alertElement.classList.remove('hide-visibility');
    }

    getToolsFromCategories() {
        const categories = document.querySelectorAll('.top-box');
        const tools = [];

        categories.forEach(category => {
            const categoryTools = [];

            category.childNodes.forEach(childNode => {
                if (childNode.nodeName === 'DIV') {
                    const toolName = childNode.textContent.trim();
                    categoryTools.push(toolName);
                }
            });

            if (categoryTools.length > 0) {
                tools.push({
                    category: category.getAttribute('data-category-id'),
                    tools: categoryTools
                });
            }
        });

        return tools;
    }

    startAttack() {
        const ipInput = document.getElementById('target-ip');
        const ipValue = ipInput.value.trim();

        if (ipValue === '') {
            this.showAlert("Lütfen bir IP adresi girin.");
        } else {
            const tools = this.getToolsFromCategories();

            if (tools.length === 0) {
                this.showAlert("Kategorilerde hiç araç bulunamadı. Lütfen bir araç ekleyin.");
            } else {
                const loadingIcon = document.getElementById('loading');
                loadingIcon.classList.remove('hide-visibility');

                let templateKey;

                switch (this.selectedTemplate) {
                    case "Ftp Brute Force Attack Template":
                        templateKey = "ftpBruteForce";
                        break;
                    case "Ssh Brute Force Attack Template":
                        templateKey = "sshBruteForce";
                        break;
                    case "BindShell Access Template":
                        templateKey = "bindShellAccess";
                        break;
                    default:
                        templateKey = "";
                        break;
                }

                const userDto = JSON.parse(localStorage.getItem('userDto'));
                const userId = userDto.id;

                const jsonData = {
                    userId: userId,
                    targetIP: ipValue,
                    pentestScenario: templateKey
                };

                const url = 'http://localhost:8888/api/v1/pentest-templates';

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                }).then(response => response.json())
                    .then(data => {
                        if (data.code === 200) {
                            const reportId = data.data;
                            return fetch('http://localhost:8888/api/v1/report-generate', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ reportId: reportId })
                            });
                        } else {
                            this.showAlert("Bir hata oluştu.");
                            throw new Error("Pentest işlemi başarısız oldu.");
                        }
                    }).then(response => {
                    if (response.ok) {
                        return response.blob();
                    } else {
                        this.showAlert("Beklenmedik sorun oluştu, işlemi yapmayı tekrar deneyin.");
                        throw new Error("PDF oluşturulamadı.");
                    }
                }).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'report.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }).catch(error => {
                    this.showAlert('Hata oluştu:', error);
                }).finally(() => {
                    loadingIcon.classList.add('hide-visibility');
                });
            }
        }
    }


}

function closeAlert() {
    document.getElementById('custom-alert').classList.add('hide-visibility');
}

document.addEventListener("DOMContentLoaded", () => {
    const manager = new DragAndDropManager();

    document.getElementById("clean-button-link").addEventListener("click", function (event) {
        event.preventDefault();
        manager.cleanCategories();
    });

    document.getElementById("start-attack-link").addEventListener("click", function (event) {
        event.preventDefault();
        manager.startAttack();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const testIp = urlParams.get('testIp');

    if (testIp) {
        const targetInput = document.getElementById('target-ip');
        if (targetInput) {
            targetInput.value = testIp;
        }
    }

    const toolInformation = document.querySelector('.tools-info');

    toolInformation.addEventListener("click", () => {
        manager.showAlert("<span style='color: #3a8d4a;'>Reconnaissance (Yeşil): Bu kategorideki araçlar, bir hedef hakkında bilgi toplamak için kullanılır.</span><br/>\
        <span style='color: #e0b830';>Enumeration (Sarı): Bu araçlar, daha derinlemesine bilgi toplama ve hedef sistemlerin detaylı analizini yapmak için kullanılır.</span><br/>\
        <span style='color: #9e1f45;'>Exploitation (Kırmızı) Bu kategorideki araçlar, tespit edilen güvenlik açıklarını kullanarak sistemlere yetkisiz erişim sağlamak için kullanılır.</span><br/>\
        Araçları kategorilere sürükleyebilirsiniz.\
        Sürüklediğiniz araçlara farenin sol tuşuyla tıklayarak parametre girebilirsiniz.\
        Sürüklediğiniz araçları farenin sağ tuşuyla kategoriden çıkarabilirsiniz.");
    });
});

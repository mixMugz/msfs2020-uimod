const CUSTOMIZE_BUTTON_DATA = {
    __Type: "ToolBarButtonData",
    buttonVisible: true,
    childActive: false,
    disabled: false,
    childDetached: false,
    ID: "PANEL_CUSTOMIZE",
    icon: "ICON_TOOLBAR_SETTINGS",
    name: Coherent.translate("TT:MENU.TOOLBAR.CUSTOM_TOOLBAR"),
    nbNotifications: 0,
    shortcut: ""
};
const ACTIVE_PAUSE_BUTTON_DATA = {
    __Type: "ToolBarButtonData",
    buttonVisible: true,
    childActive: false,
    disabled: false,
    childDetached: false,
    ID: "ACTIVE_PAUSE",
    icon: "ICON_TOOLBAR_ACTIVE_PAUSE",
    name: Coherent.translate("TT:INPUT.KEY_ACTIVE_PAUSE_TOGGLE"),
    nbNotifications: 0,
    shortcut: ""
};
class ToolBarElement extends UIElement {
    constructor() {
        super(...arguments);
        this.MOUSE_OUT_TOOLBAR_DISAPPEAR_DELAY = 300;
        this.MOUSE_OUT_PANEL_DISAPPEAR_DELAY = 80;
        this.MOUSE_OVER_PANEL_APPEAR_DELAY = 100;
        this.buttonListData = [];
        this.isActivePauseEnabled = false;
        this.onActivePauseClick = () => {
            this.m_toolbarListener.setActivePause(!this.isActivePauseEnabled);
        };
        /* Call toggler function on keypress */
        this.KeyUpHandler = (event) => {
            if (event.keyCode == mKey) {
                mToggler();
            }
        };
        this.onMouseMove = (e) => {
            if (!g_externalVariables.vrMode) {
                this.handleElement.classList.add('visible');
                clearTimeout(this.visibilityTimeout);
                this.visibilityTimeout = setTimeout(() => {
                    this.handleElement.classList.remove('visible');
                }, this.MOUSE_OUT_TOOLBAR_DISAPPEAR_DELAY);
            }
        };
        this.onMouseEnter = () => {
            this.isMouseOver = true;
            setTimeout(() => {
                clearTimeout(this.mouseOutTimeout);
                this.toggleToolbar(true);
            });
        };
        this.onMouseLeave = () => {
            if (this.classList.contains('first-flight')) {
                this.classList.remove('first-flight');
                this.m_toolbarListener.setFirstFlightInteracted();
            }
            this.isMouseOver = false;
            if (!g_externalVariables.vrMode) {
                this.mouseOutTimeout = setTimeout(this.toggleToolbar.bind(this, false), this.isActivePauseEnabled ? 3000 : 300);
            }
        };
        this.onActivePauseChanged = (paused) => {
            this.isActivePauseEnabled = paused;
            if (this.activePauseButton) {
                TemplateElement.call(this.activePauseButton, () => {
                    this.activePauseButton.selected = this.isActivePauseEnabled;
                });
            }
            if (this.isActivePauseEnabled) {
                this.toggleToolbar(true);
            }
            if (!this.isMouseOver) {
                clearTimeout(this.mouseOutTimeout);
                this.onMouseLeave();
            }
        };
        this.onPanelMouseOver = (panelID) => {
            let buttons = Array.from(this.querySelectorAll('toolbar-button'));
            let button = buttons.find(button => button.ID === panelID);
            if (button.childActive && !button.childDetached) {
                clearTimeout(this.mouseOutTimeout);
                clearTimeout(button.toggleTimeout);
            }
        };
        this.updateFirstFlight = () => {
            let firstFlight = !this.m_toolbarListener.getFirstFlightInteracted();
            this.classList.toggle('first-flight', firstFlight);
            if (firstFlight) {
                this.onMouseEnter();
            }
        };
        this.onButtonFocus = (panelID, _focused) => {
            if (!this.toolbarMode)
                return;
            let buttons = Array.from(this.querySelectorAll('toolbar-button'));
            for (let button of buttons) {
                let focused = null;
                if (panelID == button.ID)
                    focused = _focused;
                else if (_focused)
                    focused = false;
                if (focused != null) {
                    button.classList.toggle("ForceFocus", focused);
                    if (focused) {
                        this.hoveredButton = button;
                    }
                }
            }
            if (this.isCustomizePanel(panelID)) {
                if (_focused) {
                    this.hoveredButton.toggleActive(_focused);
                    UINavigation.askGrabKeys();
                    setTimeout(() => {
                        this.customizePanel.toggleVisibility(_focused);
                        this.customizePanel.toggleActive(_focused);
                        this.customizePanel.getDefaultChildButton().focusByKeys(0);
                    }, 100);
                }
                else {
                    UINavigation.releaseKeys();
                    this.customizePanel.toggleVisibility(_focused);
                    this.customizePanel.toggleActive(_focused);
                }
            }
        };
        this.onPanelModeChange = (on) => {
            this.toolbarMode = on;
            this.classList.toggle("ToolBarMode", on);
            this.toggleToolbar(on);
            if (on) {
                if (this.hoveredButton) {
                    this.hoveredButton.toggleActive(true);
                }
            }
        };
        this.updateToolBarButton = (buttonData) => {
            let button = Array.from(this.querySelectorAll('toolbar-button')).find(toolBarElement => {
                return toolBarElement.ID === buttonData.ID;
            });
            if (button) {
                let existingButtonData = this.buttonListData.find(existing => existing.ID === buttonData.ID);
                if (existingButtonData) {
                    existingButtonData.buttonVisible = buttonData.buttonVisible;
                    existingButtonData.childActive = buttonData.childActive;
                    existingButtonData.disabled = buttonData.disabled;
                    existingButtonData.childDetached = buttonData.childDetached;
                }
                if (!buttonData.buttonVisible)
                    return button.remove();
                if (buttonData.childActive != null)
                    button.childActive = buttonData.childActive;
                if (buttonData.childDetached != null)
                    button.childDetached = buttonData.childDetached;
                if (buttonData.nbNotifications != null)
                    button.nbNotifications = buttonData.nbNotifications;
                if (!buttonData.childDetached && buttonData.childActive) {
                    this.toggleToolbar(true);
                    let [x, y] = button.getAnchorPosition();
                    this.m_toolbarListener.pushPanelAttachedPosition({
                        ID: button.ID,
                        x: x,
                        y: y
                    });
                    this.hideOtherPanels(button);
                }
                if (buttonData.childDetached && !g_externalVariables.vrMode) {
                    if (!this.isMouseOver) {
                        this.toggleToolbar(false);
                    }
                }
            }
            else if (buttonData.buttonVisible && this.buttonListData.length > 0) {
                let buttonDataIndex = 0;
                this.buttonListData.some((existingButtonData, index) => {
                    if (existingButtonData.ID === buttonData.ID) {
                        existingButtonData.buttonVisible = buttonData.buttonVisible;
                        existingButtonData.childActive = buttonData.childActive;
                        existingButtonData.disabled = buttonData.disabled;
                        existingButtonData.childDetached = buttonData.childDetached;
                        return true;
                    }
                    else if (existingButtonData.disabled || !existingButtonData.buttonVisible) {
                        return false;
                    }
                    else {
                        buttonDataIndex++;
                        return false;
                    }
                });
                if (buttonDataIndex !== -1) {
                    this.addToolBarButton(buttonData, buttonDataIndex);
                }
            }
            this.customizePanel.updateCustomizationElement(buttonData);
        };
        this.toggleCustomizePanel = (data, buttonElement) => {
            buttonElement.childActive = data.childActive;
            if (data.childActive) {
                this.customizePanel.toggleActive(data.childActive);
                this.customizePanel.toggleVisibility(data.childActive);
            }
            else {
                this.customizePanel.toggleActive(data.childActive);
            }
        };
        this.setToolBarButtons = (buttonList, isFreeFlight) => {
            if (isFreeFlight) {
                this.updateFirstFlight();
            }
            else {
                this.activePauseButton.parentElement.removeChild(this.activePauseButton);
                this.activePauseButtonSeparator.parentElement.removeChild(this.activePauseButtonSeparator);
            }
            this.customizePanel.setCustomizationList(buttonList);
            buttonList.push(CUSTOMIZE_BUTTON_DATA);
            this.buttonListData = buttonList;
            let existingNodes = [];
            Array.from(this.buttonsContainer.childNodes).forEach((button) => {
                if (!buttonList.some(buttonData => buttonData.ID === button.ID)) {
                    button.remove();
                }
                else {
                    existingNodes.push(button.ID);
                }
            });
            let parseIndex = 0;
            buttonList.forEach(buttonData => {
                let button = this.buttonsContainer.querySelector(`toolbar-button[panel-id="${buttonData.ID}"]`);
                if (buttonData.buttonVisible) {
                    if (!button)
                        this.addToolBarButton(buttonData, parseIndex);
                    if (!buttonData.disabled) {
                        parseIndex++;
                    }
                }
                else if (button) {
                    button.remove();
                }
            });
            this.reorderButtons();
        };
    }
    connectedCallback() {
        this.buttonsContainer = document.getElementById("ToolBarList");
        this.handleElement = this.querySelector('.toolbar-handle');
        this.toolButtonsContainer = this.querySelector('.toolbar-list');
        this.customizePanel = this.querySelector('toolbar-customization');
        this.activePauseButton = this.querySelector("#PauseButton");
        this.activePauseButtonSeparator = this.querySelector('.toolbar-list .separator');
        TemplateElement.call(this.activePauseButton, () => {
            let data = ACTIVE_PAUSE_BUTTON_DATA;
            let button = this.activePauseButton;
            if (data.name != null)
                button.setAttribute('name', data.name);
            if (data.shortcut != null)
                button.setAttribute('shortcut', data.shortcut);
            if (data.ID != null)
                button.setAttribute('panel-id', data.ID);
            if (data.icon != null)
                button.setAttribute('icon', data.icon);
            if (data.childDetached != null)
                button.setAttribute('child-detached', data.childDetached.toString());
            if (data.childActive != null)
                button.setAttribute('button-active', data.childActive.toString());
            if (data.nbNotifications != null)
                button.setAttribute('nbNotifications', data.nbNotifications.toString());
            button.connectedCallback();
        });
        this.activePauseButton.addEventListener("OnValidate", this.onActivePauseClick);
        this.m_toolbarListener = RegisterToolBarListener();
        this.initToolBarEvents();
        this.addEventListener('mouseenter', this.onMouseEnter);
        this.addEventListener('mouseleave', this.onMouseLeave);
        window.addEventListener('mousemove', this.onMouseMove);
        this.onActivePauseChanged(this.isActivePauseEnabled);
        Coherent.on("SwitchVRModeState", (state) => {
            document.querySelector(".toolbar-container").classList.toggle('VREnabled', state);
            this.toggleToolbar(state);
        });
        this.toggleToolbar(g_externalVariables.vrMode);
        window.addEventListener("keyup", this.KeyUpHandler);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener("keyup", this.KeyUpHandler);
    }
    toggleToolbar(state) {
        if (this.toolbarMode)
            state = true;
        if (state != null) {
            this.handleElement.classList.toggle('active', state);
        }
        else {
            this.handleElement.classList.toggle('active');
        }
        const active = this.handleElement.classList.contains('active');
        this.classList.toggle('active', active);
        this.toolButtonsContainer.classList.toggle('visible', active);
        let customizeButton = this.querySelector('toolbar-button[action="CUSTOMIZE"]');
        if (!active) {
            if (customizeButton && !customizeButton.childDetached) {
                this.customizePanel.toggleVisibility(this.handleElement.classList.contains('active'));
            }
            if (this.hoveredButton && !this.isCustomizePanel(this.hoveredButton.ID) && !this.hoveredButton.childDetached && this.hoveredButton.childActive) {
                this.m_toolbarListener.setButtonChildActive(this.hoveredButton.ID, false);
            }
            Array.from(this.querySelectorAll('toolbar-button'))
                .filter(button => button.childActive && !button._childDetached)
                .forEach(buttonElement => {
                if (this.isCustomizePanel(buttonElement.ID)) {
                    this.hideCustomizePanel(buttonElement);
                }
                else {
                    buttonElement.toggleActive(false);
                    buttonElement.toggleVisible(false);
                }
            });
        }
    }
    initToolBarEvents() {
        this.m_toolbarListener.onSetToolBarElements(this.setToolBarButtons);
        this.m_toolbarListener.onUpdateToolBarElement(this.updateToolBarButton);
        this.m_toolbarListener.onInGamePanelMouseOver(this.onPanelMouseOver);
        this.m_toolbarListener.onToolBarButtonFocusChange(this.onButtonFocus);
        this.m_toolbarListener.onToolbarMode(this.onPanelModeChange);
        this.m_toolbarListener.onActivePauseUpdate(this.onActivePauseChanged);
    }
    onPanelMouseOut(panelID) {
        if (!this.hoveredButton || this.hoveredButton.ID !== panelID) {
            let buttons = Array.from(this.querySelectorAll('toolbar-button'));
            let button = buttons.find(button => button.ID === panelID);
            if (!button.childDetached) {
                clearTimeout(button.toggleTimeout);
                button.toggleTimeout = setTimeout(() => {
                    this.onToolBarButtonToggleActive({
                        target: button,
                        detail: {
                            childActive: false
                        }
                    });
                }, this.MOUSE_OUT_PANEL_DISAPPEAR_DELAY);
                clearTimeout(this.mouseOutTimeout);
                if (!this.isMouseOver) {
                    this.mouseOutTimeout = setTimeout(this.toggleToolbar.bind(this, false), this.MOUSE_OVER_PANEL_APPEAR_DELAY);
                }
            }
        }
    }
    hideCustomizePanel(buttonElement) {
        buttonElement.childActive = false;
        this.customizePanel.toggleActive(false);
        this.customizePanel.toggleVisibility(false);
    }
    addToolBarButton(data, insertAt) {
        let button = new ToolBarButtonElement();
        if (data.name != null)
            button.setAttribute('name', data.name);
        if (data.shortcut != null)
            button.setAttribute('shortcut', data.shortcut);
        if (data.ID != null)
            button.setAttribute('panel-id', data.ID);
        if (data.icon != null)
            button.setAttribute('icon', data.icon);
        if (data.childDetached != null)
            button.setAttribute('child-detached', data.childDetached.toString());
        if (data.childActive != null)
            button.setAttribute('button-active', data.childActive.toString());
        if (data.nbNotifications != null)
            button.setAttribute('nbNotifications', data.nbNotifications.toString());
        button.addEventListener("toggleVisible", (e) => {
            if (e.detail.childVisible) {
                this.hoveredButton = e.target;
            }
            this.onToolBarButtonToggleVisible(e);
        });
        button.addEventListener("toggleActive", (e) => {
            this.onToolBarButtonToggleActive(e);
        });
        button.addEventListener('OnFocus', () => {
            if (!g_externalVariables.vrMode) {
                this.hideOtherPanels(button);
            }
        });
        if (insertAt != null) {
            this.buttonsContainer.insertBefore(button, this.buttonsContainer.children[insertAt]);
        }
        else {
            this.buttonsContainer.appendChild(button);
        }
        setTimeout(() => {
            if (!data.childDetached && data.childActive) {
                this.toggleToolbar(true);
                let [x, y] = button.getAnchorPosition();
                this.m_toolbarListener.pushPanelAttachedPosition({
                    ID: button.ID,
                    x: x,
                    y: y
                });
            }
        }, 300);
    }
    onToolBarButtonToggleActive(e) {
        let eventData = e.detail;
        let buttonElement = e.target;
        if (eventData.childActive && !eventData.childDetached) {
            this.hideOtherPanels(buttonElement);
        }
        buttonElement.classList.toggle("child-active", eventData.childActive);
        eventData.ID = buttonElement.ID;
        if (this.isCustomizePanel(buttonElement.ID)) {
            if (this.isCustomizePanel(buttonElement.ID)) {
                eventData.x -= this.getBoundingClientRect().left;
                eventData.y -= this.getBoundingClientRect().top;
            }
            setTimeout(() => {
                this.toggleCustomizePanel(eventData, buttonElement);
            }, 50);
            this.m_toolbarListener.pushPanelAttachedPosition(eventData);
        }
        else {
            this.m_toolbarListener.setButtonChildActive(buttonElement.ID, eventData.childActive);
            if (!buttonElement.childDetached) {
                this.m_toolbarListener.pushPanelAttachedPosition(eventData);
            }
        }
        this.customizePanel.updateCustomizationElement(buttonElement.getData());
    }
    onToolBarButtonToggleVisible(e) {
        let eventData = e.detail;
        let buttonElement = e.target;
        this.m_toolbarListener.pushLocalPanelVisibility(buttonElement.ID, eventData.childVisible);
        eventData.ID = buttonElement.ID;
        if (eventData.childVisible) {
            this.hideOtherPanels(buttonElement);
            if (this.isCustomizePanel(buttonElement.ID)) {
                eventData.x -= this.getBoundingClientRect().left;
                eventData.y -= this.getBoundingClientRect().top;
            }
            this.m_toolbarListener.pushPanelAttachedPosition(eventData);
        }
        this.customizePanel.updateCustomizationElement(buttonElement.getData());
    }
    hideOtherPanels(buttonElement) {
        Array.from(this.querySelectorAll('toolbar-button'))
            .filter(button => button.ID !== buttonElement.ID && button.childActive && !button._childDetached)
            .forEach(buttonElement => {
            if (this.isCustomizePanel(buttonElement.ID)) {
                this.hideCustomizePanel(buttonElement);
            }
            else {
                buttonElement.toggleActive(false);
                buttonElement.toggleVisible(false);
                buttonElement.classList.toggle("ForceFocus", false);
            }
        });
    }
    reorderButtons() {
        let buttonList = Array.from(this.buttonsContainer.querySelectorAll('toolbar-button'));
        buttonList.sort((a, b) => {
            if (a.getAttribute('panel-id') == "PANEL_CUSTOMIZE" || a.name > b.name)
                return 1;
            if (b.getAttribute('panel-id') == "PANEL_CUSTOMIZE" || a.name < b.name)
                return -1;
            else
                return 0;
        });
        buttonList.forEach(button => {
            this.buttonsContainer.appendChild(button);
        });
    }
    isCustomizePanel(buttonID) {
        return buttonID === "PANEL_CUSTOMIZE";
    }
}
window.customElements.define("tool-bar", ToolBarElement);
g_debugMgr.AddDebugButton("ADD TOOLBAR", () => {
    Coherent.trigger("AddToolBarElement", {});
});
checkAutoload();
let bTest = false;
if (bTest) {
    let fakeData = [
        {
            ID: "ATC",
            name: "ATC",
            icon: "ICON_TOOLBAR_ATC",
            nbNotifications: 0,
            disabled: false,
            buttonVisible: true,
            childDetached: false,
            childActive: false,
        }, {
            ID: "CHECKLIST",
            name: "CHECKLIST",
            icon: "ICON_TOOLBAR_CHECKLIST",
            nbNotifications: 0,
            disabled: false,
            buttonVisible: true,
            childDetached: false,
            childActive: false,
        },
        {
            ID: "WEATHER",
            name: "WEATHER",
            icon: "ICON_TOOLBAR_WEATHER",
            nbNotifications: 0,
            buttonVisible: true,
            childDetached: false,
            disabled: false,
            childActive: false,
        },
        {
            ID: "CUSTOM",
            icon: "ICON_TOOLBAR_SETTINGS",
            name: "CUSTOMIZE",
            nbNotifications: 0,
            disabled: false,
            buttonVisible: true,
            childDetached: false,
            childActive: false,
        }
    ];
    Coherent.on('TOOLBAR_BUTTON_TOGGLE', (data) => {
        let clickedButtonData = fakeData.find(button => button.ID === data.ID);
        clickedButtonData.childActive = data.childActive;
        Coherent.trigger('UpdateToolBarElement', clickedButtonData);
        if (data.ID === "CUSTOMIZE") {
            Coherent.trigger('ToggleCustomizePanel', data);
        }
    });
    Coherent.on("TOOLBAR_BUTTON_DETACH", (data) => {
        let clickedButton = fakeData.find(button => button.ID === data.ID);
        clickedButton.childDetached = data.childDetached;
        if (clickedButton) {
            Coherent.trigger("UpdateToolBarElement", clickedButton);
            Coherent.trigger("IngameUiDetach", {
                name: data.ID,
                detached: data.childDetached
            });
        }
    });
    Coherent.on("VALIDATE", (actionName, state) => {
        let buttonName = actionName.replace("DISPLAY_", "");
        let buttonData = fakeData.find(button => button.ID === buttonName);
        if (buttonData) {
            buttonData.buttonVisible = state;
            Coherent.trigger("SetToolBarElements", fakeData);
        }
    });
    setTimeout(() => {
        Coherent.trigger("SetToolBarElements", fakeData);
        Coherent.trigger("SetToolBarCustomizationList", fakeData.filter(button => button.ID !== "CUSTOMIZE"));
        Coherent.trigger("IngameUiDetach", {
            name: "CUSTOMIZE",
            detached: false
        });
    }, 500);
}
//# sourceMappingURL=Toolbar.js.map
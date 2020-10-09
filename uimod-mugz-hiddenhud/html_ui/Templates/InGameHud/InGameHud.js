class InGameHud extends TemplateElement {
    constructor() {
        super();
        this.content = null;
        this.connected = false;
        this.opacity = 0;
        this.lastTime = 0;
        this.KeyUpHandler = (event) => {
            if (event.keyCode == 144) {
                this.m_hudElem.style.display = (this.m_hudElem.style.display == 'none') ? '' : 'none';
            }
        };
    }
    get templateID() { return "InGameHudTemplate"; }
    hasContent() { return (this.baseHud != null); }
    connectedCallback() {
        super.connectedCallback();
        this.content = window.document.querySelector(".content");
        this.m_hudElem = window.document.getElementById("InGameHud");
        this.tabIndex = 1;
        this.connected = true;
        this.SetOpacity(0);
        if (this.frameToShow) {
            this.Show(this.frameToShow);
        }
        else {
            var type = this.getAttribute('type');
            if (type) {
                this.Show(new Name_Z(type));
            }
        }
        this.lastTime = Date.now();
        let updateLoop = () => {
            if (!this.connected)
                return;
            try {
                this.Update();
            }
            catch (Error) {
                console.error(document.title + " : " + Error);
            }
            requestAnimationFrame(updateLoop);
        };
        requestAnimationFrame(updateLoop);
        window.addEventListener("keyup", this.KeyUpHandler);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.connected = false;
        window.removeEventListener("keyup", this.KeyUpHandler);
    }
    Show(_nameZ) {
        if (!this.connected) {
            this.frameToShow = _nameZ;
            return;
        }
        var fileName = "";
        if (Name_Z.compareStr(_nameZ, "Power")) {
            document.title = "HUD - Power";
            if (Simplane.getEngineType() == EngineType.ENGINE_TYPE_PISTON && !Simplane.getHasGlassCockpit()) {
                fileName = "Piston/Piston_Power.html";
            }
            else {
                fileName = "Turbine/Turbine_Power.html";
            }
        }
        else if (Name_Z.compareStr(_nameZ, "Compass")) {
            document.title = "HUD - Compass";
            fileName = "Turbine/Turbine_Compass.html";
        }
        else if (Name_Z.compareStr(_nameZ, "Altimeter")) {
            document.title = "HUD - Altimeter";
            if (Simplane.getEngineType() == EngineType.ENGINE_TYPE_PISTON && !Simplane.getHasGlassCockpit()) {
                fileName = "Piston/Piston_Altimeter.html";
            }
            else {
                fileName = "Turbine/Turbine_Altimeter.html";
            }
        }
        else if (Name_Z.compareStr(_nameZ, "AoA")) {
            document.title = "HUD - AoA";
            if (Simplane.getEngineType() == EngineType.ENGINE_TYPE_PISTON && !Simplane.getHasGlassCockpit()) {
                fileName = "Piston/Piston_AOA.html";
            }
            else {
                fileName = "Turbine/Turbine_AOA.html";
            }
        }
        else {
            console.error("Can't find HUD " + _nameZ.str);
            return;
        }
        var url = InGameHud.InstrumentRoot + fileName;
        Include.setAsyncLoading(false);
        Include.addImport(url);
    }
    registerHUD(_hudName, _hudClass) {
        console.log("Registering hud " + _hudName);
        this.tryCreateHUD(_hudName);
    }
    tryCreateHUD(_hudName) {
        var stillLoading = Include.isLoadingScript(InGameHud.InstrumentRoot);
        if (stillLoading) {
            setTimeout(this.tryCreateHUD.bind(this, _hudName), 500);
            return;
        }
        try {
            var template = document.createElement(_hudName);
        }
        catch (error) {
            console.error("Error while creating HUD. Retrying...");
            setTimeout(this.tryCreateHUD.bind(this, _hudName), 500);
            return;
        }
        if (template) {
            console.log("HUD " + _hudName + " created");
            this.content.appendChild(template);
            this.baseHud = template;
        }
    }
    Update() {
        if (this.baseHud) {
            var curTime = Date.now();
            var deltaTime = (curTime - this.lastTime) / 1000;
            this.lastTime = curTime;
            if (this.opacity < 1.0) {
                var opacity = this.opacity + (0.65 * deltaTime);
                this.SetOpacity(opacity);
            }
            this.baseHud.update(deltaTime);
        }
    }
    SetOpacity(_val) {
        this.opacity = Math.max(Math.min(_val, 1.0), 0);
        this.style.opacity = this.opacity.toString();
    }
    Focus(_name) {
        console.log("Focusing " + _name);
        if (document.title == _name) {
            this.classList.add("highlight");
            this.classList.remove("fade");
        }
        else {
            this.classList.add("fade");
            this.classList.remove("highlight");
        }
    }
    UnFocus() {
        this.classList.remove("highlight");
        this.classList.remove("fade");
    }
}
InGameHud.InstrumentRoot = "/Templates/InGameHud/Avionics/";
window.customElements.define("ingame-hud", InGameHud);
function registerHUD(_hudName, _hudClass) {
    var hud = window.document.getElementById("InGameHud");
    if (hud) {
        window.customElements.define(_hudName, _hudClass);
        hud.registerHUD(_hudName, _hudClass);
    }
}
class BaseHUD extends TemplateElement {
    update(dTime) {
    }
}
checkAutoload();
//# sourceMappingURL=InGameHud.js.map
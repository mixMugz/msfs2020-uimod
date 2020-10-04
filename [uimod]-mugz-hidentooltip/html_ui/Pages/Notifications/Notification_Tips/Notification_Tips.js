class Notification_Tips extends NotificationElement {
    constructor() {
        super();
    }
    get templateID() { return "Notification_TipsTemplate"; }
    SetUpNotif(_oData) {
        super.SetUpNotif(_oData);
        this.classList.remove("hide");
        this.classList.remove("disappear");
        let gameplayTitle = this.querySelector('.gameplayTitle');
        gameplayTitle.innerHTML = Coherent.translate(gameplayTitle.getAttribute('data-title'));
    }
    setObjective(title) {
        this.querySelector(".title").innerHTML = Coherent.translate(title);
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("dataStorageReady", function () {
            setElementPosition(this);
        }.bind(this));
    }
    CleanUp() {
        super.CleanUp();
        if (this._eButton)
            this._eButton.removeEventListener("click", this.OnClick.bind(this));
    }
}
window.customElements.define("notification-tips", Notification_Tips);
class NotificationTooltipElement extends TemplateElement {
    constructor() {
        super();
        this.KeyUpHandler = (event) => {
            if (event.keyCode == 18) {
                this.style.display = "none";
            }
        };
        this.KeyDownHandler = (event) => {
            if (event.keyCode == 18) {
                this.style.display = "block";
            }
        };
    }
    get templateID() { return "NotificationTooltipTemplate"; }
    ;
    connectedCallback() {
        super.connectedCallback();
        this.m_textElem = this.querySelector(".Text");
        window.addEventListener("keyup", this.KeyUpHandler);
        window.addEventListener("keydown", this.KeyDownHandler);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("keyup", this.KeyUpHandler);
        window.removeEventListener("keydown", this.KeyDownHandler);
    }
    setTooltip(text, posX, posY, maxWidth) {
        this.m_textElem.innerHTML = text;
        if (posX < 0) {
            posX = window.innerWidth * -posX;
            posY = window.innerHeight * -posY;
        }
        if (maxWidth > 0) {
            this.style.maxWidth = maxWidth + "px";
        }
        else {
            this.style.maxWidth = null;
        }
        this.style.setProperty("--posLeft", posX + "px");
        this.style.setProperty("--posTop", posY + "px");
        this.classList.toggle("hide", text == "");
        void this.m_textElem.offsetWidth;
        let rect = this.m_textElem.getBoundingClientRect();
        if (posY + rect.height > window.innerHeight) {
            posY = window.innerHeight - rect.height;
        }
        if (posX + rect.width * 0.5 > window.innerWidth) {
            posX = window.innerWidth - rect.width / 2;
        }
        if (posX < rect.width / 2) {
            posX = rect.width / 2;
        }
        if (posY < 0) {
            posY = 0;
        }
        this.style.setProperty("--posLeft", posX + "px");
        this.style.setProperty("--posTop", posY + "px");
    }
}
window.customElements.define("notification-tooltip", NotificationTooltipElement);
checkAutoload();
//# sourceMappingURL=Notification_Tips.js.map
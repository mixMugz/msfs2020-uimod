var AirTrafficDataType;
(function (AirTrafficDataType) {
    AirTrafficDataType["PLANE_ALTITUDE"] = "PLANE_ALTITUDE";
    AirTrafficDataType["PLANE_TYPE"] = "PLANE_TYPE";
    AirTrafficDataType["PLANE_ORIGIN"] = "PLANE_ORIGIN";
    AirTrafficDataType["PLANE_SPEED"] = "PLANE_SPEED";
})(AirTrafficDataType || (AirTrafficDataType = {}));
class IGM_TrafficElement_3D extends InGameMarkerBaseElement {
    constructor() {
        super();
        this.m_dataItems = [];
        this.KeyUpHandler = (event) => {
            if (event.keyCode == 123) {
                this.m_name.style.display = 'none';
                this.m_dataElem.style.display = 'none';
            }
            if (event.keyCode == 122) {
                this.m_name.style.display = '';
                this.m_dataElem.style.display = '';
            }
        };
    }
    get templateID() { return "IGM_AirTraffic_3D_Template"; }
    ;
    connectedCallback() {
        super.connectedCallback();
        this.m_name = this.querySelector('.name');
        this.m_dataElem = this.querySelector('.data');
        window.addEventListener("keyup", this.KeyUpHandler);
    }
    disconnectedCallback() {
        window.removeEventListener("keyup", this.KeyUpHandler);
    }
    setData(data) {
        this.debug = false;
        data = this.sanitizeData(data);
        this.m_name.innerHTML = data.title.text.valueStr;
        if (!data.datas || !data.datas.length) {
            this.cleanData();
            return;
        }
        if (!this.m_data || this.m_data.datas.length != data.datas.length)
            this.cleanData();
        let dataTypes = data.datas.map(i => i.text.type);
        if (this.debug)
            console.log('Datatypes requested : ', dataTypes);
        if (this.m_data && this.m_data.datas.map(i => i.text.type).join() !== dataTypes.join())
            this.cleanData();
        this.m_data = data;
        if (this.debug)
            console.log('Updating/Creating Data');
        let dataContentWidth = 0;
        data.datas.forEach((d, i) => {
            let value = d.text;
            let existingDataItem = this.m_dataItems.find(i => i.dataType == value.type);
            if (existingDataItem) {
                if (existingDataItem.data.valueStr == value.valueStr && existingDataItem.data.unit == value.unit) {
                    if (this.debug)
                        console.log('--- Skipping updating, same values and units for : ', '[' + value.type.toUpperCase() + ']');
                }
                else {
                    if (this.debug)
                        console.log('--- Updating', '[' + value.type.toUpperCase() + ']');
                    existingDataItem.setData(value);
                }
                dataContentWidth += existingDataItem.getBoundingClientRect().width;
            }
            else {
                if (this.debug)
                    console.log('--- Creating', '[' + value.type.toUpperCase() + ']');
                let dataItem = document.createElement('igm-airtraffic-data-3d');
                dataItem.classList.add('data-item');
                dataItem.setData(value);
                dataContentWidth += dataItem.getBoundingClientRect().width;
                this.m_dataElem.appendChild(dataItem);
                this.m_dataItems.push(dataItem);
                if (i >= data.datas.length - 1)
                    return;
                let separatorItem = document.createElement('div');
                separatorItem.classList.add('separator');
                this.m_dataElem.appendChild(separatorItem);
                dataContentWidth += separatorItem.getBoundingClientRect().width;
            }
        });
        this.classList.toggle("detailed", !data.smallTextBox);
        this.m_dataElem.classList.toggle('condensed', dataContentWidth >= this.getBoundingClientRect().width * 0.75);
    }
    sanitizeData(data) {
        let indexToSplice = [];
        data.title.text.valueStr = data.title.text.valueStr || "Unknown";
        data.datas.forEach((d, i) => {
            if (!d.text.type) {
                indexToSplice.push(i);
                return;
            }
            if (!d.text.valueStr) {
                indexToSplice.push(i);
                return;
            }
            if (!d.text.unit) {
                data.datas[i].text.unit = null;
            }
            if (Number(d.text.valueStr) && [AirTrafficDataType.PLANE_ALTITUDE, AirTrafficDataType.PLANE_SPEED].includes(d.text.type)) {
                data.datas[i].text.valueStr = Utils.formatInteger(Number(d.text.valueStr));
            }
        });
        indexToSplice.forEach(i => data.datas = data.datas.splice(i, 1));
        return data;
    }
    cleanData() {
        if (!this.m_dataElem.children.length && !this.m_dataItems.length)
            return;
        if (this.debug)
            console.log('Cleaning data');
        this.classList.toggle("detailed", false);
        this.m_dataItems = [];
        this.m_dataElem.classList.toggle("condensed", false);
        Utils.RemoveAllChildren(this.m_dataElem);
    }
}
window.customElements.define("igm-airtraffic-3d", IGM_TrafficElement_3D);
class IGM_TrafficElement_Data_3D extends TemplateElement {
    get templateID() { return "IGM_AirTraffic_Data_3D_Template"; }
    ;
    connectedCallback() {
        super.connectedCallback();
        this.m_valueElem = this.querySelector('.value');
        this.m_unitElem = this.querySelector('.unit');
        if (this.m_data)
            this.setData(this.m_data);
    }
    get dataType() { return this.getAttribute('data-type'); }
    set dataType(type) { this.setAttribute('data-type', type); }
    get data() {
        return this.m_data;
    }
    setData(data) {
        this.m_data = data;
        this.dataType = data.type;
        if (this.isConnected) {
            let str = data.valueStr;
            let unit = data.unit || null;
            this.m_valueElem.innerHTML = str;
            this.m_unitElem.innerHTML = unit;
            this.m_unitElem.classList.toggle('hide', unit == null);
            this.classList.toggle('hide', false);
        }
    }
    clear() {
        this.m_data = null;
        this.classList.toggle('hide', true);
        this.m_valueElem.innerHTML = "";
        this.m_unitElem.innerHTML = "";
        this.m_unitElem.classList.toggle('hide', true);
    }
}
window.customElements.define("igm-airtraffic-data-3d", IGM_TrafficElement_Data_3D);
checkAutoload();
//# sourceMappingURL=IGM_AirTraffic.js.map
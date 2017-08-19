"use strict";
import * as vscode from "vscode";
import TelemetryReporter from "vscode-extension-telemetry";
import { Constants } from "./constants";
import { Utility } from "./utility";

const extensionVersion: string = vscode.extensions.getExtension(Constants.ExtensionId).packageJSON.version;

export class TelemetryClient {
    public static sendEvent(eventName: string, properties?: { [key: string]: string; }): void {
        properties = this.addIoTHubHostName(properties);
        this._client.sendTelemetryEvent(eventName, properties);
    }

    private static _client = new TelemetryReporter(Constants.ExtensionId, extensionVersion, Constants.AIKey);

    private static addIoTHubHostName(properties?: { [key: string]: string; }): any {
        let newProperties = properties ? properties : {};
        let iotHubConnectionString = Utility.getConnectionStringWithId(Constants.IotHubConnectionStringKey);
        if (!iotHubConnectionString) {
            iotHubConnectionString = Utility.getConnectionStringWithId(Constants.DeviceConnectionStringKey);
        }

        if (iotHubConnectionString) {
            let iotHubHostName = Utility.getHostName(iotHubConnectionString);
            if (iotHubHostName) {
                newProperties.IoTHubHostName = Utility.hash(iotHubHostName);
            }
        }
        return newProperties;
    }
}

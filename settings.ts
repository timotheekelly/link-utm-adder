import { PluginSettingTab, Setting } from "obsidian";
import LinkDisplayPlugin from "main";

export interface LinkDisplaySettings {
  trackedDomains: string;   // Comma-separated list of domains
  utmCampaign: string;
  utmSource: string;
  utmMedium: string;
  utmContent: string;
  utmTerm: string;
}

export const DEFAULT_SETTINGS: LinkDisplaySettings = {
  trackedDomains: "example.com", // Default example
  utmCampaign: "devrel",
  utmSource: "third-party-content",
  utmMedium: "cta",
  utmContent: "",
  utmTerm: "tim.kelly",
};

export class LinkDisplaySettingTab extends PluginSettingTab {
  plugin: LinkDisplayPlugin;

  constructor(plugin: LinkDisplayPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Link Display Settings" });

    // Tracked Domains
    new Setting(containerEl)
      .setName("Tracked Domains")
      .setDesc("Comma-separated list of domains to track. All subdomains are automatically included (e.g., mongodb.com will match learn.mongodb.com).")
      .addTextArea((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.trackedDomains)
          .setValue(this.plugin.settings.trackedDomains)
          .onChange(async (value) => {
            this.plugin.settings.trackedDomains = value;
            await this.plugin.saveSettings();
            this.plugin.updateLinkPanel();
          })
      );
  }
}

import { Plugin, WorkspaceLeaf } from "obsidian";
import { LinkPanel } from "./LinkPanel";
import { LinkDisplaySettingTab, DEFAULT_SETTINGS, LinkDisplaySettings } from "./settings";

export default class LinkDisplayPlugin extends Plugin {
  settings: LinkDisplaySettings;

  private buildDomainRegex(): RegExp {
    const domains = this.settings.trackedDomains
      .split(",")
      .map((d) => d.trim().replace(/\./g, "\\."))
      .filter((d) => d.length > 0);
  
    // Always allow subdomains for each domain
    const domainPattern = domains.map(d => `(?:[a-zA-Z0-9-]+\\.)?${d}`).join("|");
  
    return new RegExp(`\\[[^\\]]*\\]\\((https?:\\/\\/(?:${domainPattern})[^)]+)\\)`, "g");
  }  
  
  async onload() {
    console.log("Loading UTM Linker Plugin");
    await this.loadSettings();

    this.registerView("link-panel", (leaf: WorkspaceLeaf) => new LinkPanel(leaf, this));

    this.addCommand({
      id: "show-link-panel",
      name: "Show Link Panel",
      callback: () => this.openLinkPanel(),
    });

    this.registerEvent(this.app.workspace.on("active-leaf-change", () => {
      this.updateLinkPanel();
    }));

    this.registerEvent(this.app.workspace.on("editor-change", () => {
      this.updateLinkPanel();
    }));

    this.addSettingTab(new LinkDisplaySettingTab(this));

    this.openLinkPanel();
  }

  onunload() {
    console.log("Unloading UTM Link Plugin");
    this.app.workspace.detachLeavesOfType("link-panel");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async openLinkPanel() {
    if (this.app.workspace.getLeavesOfType("link-panel").length === 0) {
      const leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({ type: "link-panel", active: true });
    }
    this.updateLinkPanel();
  }

  updateLinkPanel() {
    const leaf = this.app.workspace.getLeavesOfType("link-panel")[0];
    if (!leaf) return;
  
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) return;
  
    const regex = this.buildDomainRegex();
  
    this.app.vault.read(activeFile).then((content) => {
      const links = Array.from(content.matchAll(regex)).map((m) => m[1]);
      (leaf.view as LinkPanel).updateLinks(links);
    });
  }
  
}

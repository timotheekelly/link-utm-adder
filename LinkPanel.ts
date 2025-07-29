import LinkDisplayPlugin from "main";
import { ItemView, WorkspaceLeaf } from "obsidian";

export class LinkPanel extends ItemView {
  linksWithUTM: string[] = [];
  linksWithoutUTM: string[] = [];

  utmCampaign: string;
  utmSource: string;
  utmMedium: string;
  utmContent: string;
  utmTerm: string;

  plugin: LinkDisplayPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: LinkDisplayPlugin) {
    super(leaf);
    this.plugin = plugin;

    this.utmCampaign = plugin.settings.utmCampaign;
    this.utmSource = plugin.settings.utmSource;
    this.utmMedium = plugin.settings.utmMedium;
    this.utmContent = plugin.settings.utmContent;
    this.utmTerm = plugin.settings.utmTerm;

    this.render();
  }

  getViewType() {
    return "link-panel";
  }

  getDisplayText() {
    return "UTM Linker";
  }

  async onOpen() {
    this.render();
  }

  async onClose() {
    this.containerEl.empty();
  }

  updateLinks(links: string[]) {
    this.linksWithUTM = links.filter((link) => link.includes("utm_"));
    this.linksWithoutUTM = links.filter((link) => !link.includes("utm_"));
    this.render();
  }

  getUTMTag(): string {
    const params = new URLSearchParams();
    params.set("utm_campaign", this.utmCampaign);
    if (this.utmSource) params.set("utm_source", this.utmSource);
    if (this.utmMedium) params.set("utm_medium", this.utmMedium);
    if (this.utmContent) params.set("utm_content", this.utmContent);
    if (this.utmTerm) params.set("utm_term", this.utmTerm);
    return params.toString();
  }

  applyUTMTag() {
    const activeFile = this.plugin.app.workspace.getActiveFile();
    if (!activeFile) return;

    const utmTag = this.getUTMTag();

    this.plugin.app.vault.read(activeFile).then((content: string) => {
      let updatedContent = content;

      this.linksWithoutUTM.forEach((originalLink) => {
        const utmLink = originalLink.includes("?")
          ? `${originalLink}&${utmTag}`
          : `${originalLink}?${utmTag}`;
        const regex = new RegExp(
          `(\\[.*?\\]\\()(${originalLink.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(\\))`,
          "g"
        );
        updatedContent = updatedContent.replace(regex, `$1${utmLink}$3`);
      });

      this.plugin.app.vault.modify(activeFile, updatedContent);
    });
  }

  removeAllUTMTags() {
    const activeFile = this.plugin.app.workspace.getActiveFile();
    if (!activeFile) return;

    this.plugin.app.vault.read(activeFile).then((content: string) => {
      let updatedContent = content;
      this.linksWithUTM.forEach((link) => {
        const cleanedLink = link.replace(/(\?|&)?utm_[^&]+/g, "");
        const regex = new RegExp(
          `(\\[.*?\\]\\()(${link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(\\))`,
          "g"
        );
        updatedContent = updatedContent.replace(regex, `$1${cleanedLink}$3`);
      });
      this.plugin.app.vault.modify(activeFile, updatedContent);
    });
  }

  render() {
    this.containerEl.empty();
    const contentEl = this.containerEl.createDiv({ cls: "link-panel-content" });

    const createUTMField = (
      label: string,
      value: string,
      placeholder: string,
      onChange: (val: string) => void,
      isDisabled = false
    ) => {
      const div = contentEl.createDiv({ cls: "utm-field-container" });
      div.createEl("label", { text: label });
      const input = div.createEl("input", { type: "text", placeholder });
      input.value = value;
      input.disabled = isDisabled;
      input.oninput = async (e) => {
        const val = (e.target as HTMLInputElement).value;
        onChange(val);
        await this.plugin.saveSettings();
      };
    };

    // UTM fields
    createUTMField("Campaign:", this.utmCampaign, "devrel", (val) => {
      this.utmCampaign = val;
      this.plugin.settings.utmCampaign = val;
    }, true);

    createUTMField("Source:", this.utmSource, "e.g., Third-Party Content", (val) => {
      this.utmSource = val;
      this.plugin.settings.utmSource = val;
    });

    createUTMField("Medium:", this.utmMedium, "e.g., Call To Action Link", (val) => {
      this.utmMedium = val;
      this.plugin.settings.utmMedium = val;
    });

    createUTMField("Content:", this.utmContent, "e.g., obsidian search", (val) => {
      this.utmContent = val;
      this.plugin.settings.utmContent = val;
    });

    createUTMField("Term:", this.utmTerm, "e.g., tim.kelly", (val) => {
      this.utmTerm = val;
      this.plugin.settings.utmTerm = val;
    });

    // Buttons container
    const buttonContainer = contentEl.createDiv({ cls: "button-container" });
    const applyButton = buttonContainer.createEl("button", { text: "Apply UTM Tag" });
    applyButton.onclick = () => this.applyUTMTag();

    const removeButton = buttonContainer.createEl("button", { text: "Remove All UTM Tags" });
    removeButton.onclick = () => this.removeAllUTMTags();

    // Links with UTM
    contentEl.createEl("h3", { text: "Links with UTM Parameters" });
    if (this.linksWithUTM.length === 0) {
      contentEl.createEl("p", { text: "No links with UTM parameters found." });
    } else {
      const listWithUTM = contentEl.createEl("ul", { cls: "utm-link-list" });
      this.linksWithUTM.forEach((link) => {
        const item = listWithUTM.createEl("li");
        item.createEl("a", { text: link, href: link }).setAttr("target", "_blank");
      });
    }

    // Links without UTM
    contentEl.createEl("h3", { text: "Links without UTM Parameters" });
    if (this.linksWithoutUTM.length === 0) {
      contentEl.createEl("p", { text: "No links without UTM parameters found." });
    } else {
      const listWithoutUTM = contentEl.createEl("ul", { cls: "utm-link-list" });
      this.linksWithoutUTM.forEach((link) => {
        const item = listWithoutUTM.createEl("li");
        item.createEl("a", { text: link, href: link }).setAttr("target", "_blank");
      });
    }
  }
}

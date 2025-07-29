# Link Display Plugin for Obsidian

The **Link Display Plugin** helps you manage and track URLs inside your Obsidian notes by automatically adding or removing UTM parameters. It provides a dedicated side panel that lists all links in the current note, categorizing them into links with and without UTM parameters. You can quickly add standardized tracking tags or remove them with a single click.

---

## **Features**

* **Link Panel View**
  Displays all links in the current note, divided into:

  * **Links with UTM Parameters**
  * **Links without UTM Parameters**

* **Add UTM Parameters**
  Apply a set of UTM parameters (Campaign, Source, Medium, Content, Term) to all links without them in one click.

* **Remove UTM Parameters**
  Instantly strip all UTM tags from links in the active file.

* **Customizable Fields**
  Set and persist default UTM fields like Source, Medium, Content, and Term.

* **Easy Link Editing**
  Live-update UTM fields directly from the panel, and changes are saved in plugin settings.

---

## **Installation**

### **From Source**

1. Clone or download this repository.
2. Build the plugin:

   ```bash
   npm install
   npm run build
   ```
3. Copy the `main.js`, `manifest.json`, and `styles.css` files into:

   ```
   <YourVault>/.obsidian/plugins/link-display
   ```
4. Open Obsidian → **Settings → Community Plugins**.
5. Enable **Link Display Plugin**.

---

## **Usage**

1. Open a note containing links.
2. Run the **"Show Link Panel"** command or click the plugin's button (if you add it to the ribbon).
3. In the **Link Panel**:

   * Review links with and without UTM parameters.
   * Modify UTM fields (Source, Medium, Content, Term).
   * Click **"Apply UTM Tag"** to add tracking tags to all links without them.
   * Click **"Remove All UTM Tags"** to clean all links from tracking parameters.

---

## **Default UTM Settings**

The default UTM parameters are:

* **Campaign:** `devrel` (fixed)
* **Source:** `Third-Party Content`
* **Medium:** `Call To Action Link`
* **Content:** `obsidian search`
* **Term:** `tim.kelly`

You can change **Source**, **Medium**, **Content**, and **Term** in the plugin panel, and they will persist across sessions.

---

## **CSS Customization**

You can modify the plugin appearance using the included `styles.css`.
For example, buttons are styled with padding and hover effects:

```css
.link-panel-content button {
  padding: 6px 12px;
  margin-right: 5px;
}
```

---

## **Development**

To work on the plugin:

```bash
npm install
npm run dev
```

The build output will appear in the project root. You can symlink the plugin folder to your Obsidian vault for easier testing.

---

## **Future Improvements**

* Add single-link UTM editing directly from the panel.
* Bulk UTM customization templates.
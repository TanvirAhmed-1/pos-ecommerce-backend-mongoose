const fs = require('fs');

console.log("Upgrading Admin Dashboard and Frontend with dedicated Description tab, Specs Builder, and Edit links...");

// 1. Create/Update DescriptionTab in Admin Dashboard
const descTabPath = 'G:/ECommerce_POS_Admin_Dashboard/e-commerce-pos-admin-dashboard/src/components/ui/commerce/products/create/DescriptionTab.tsx';
const descTabContent = `"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  FileCode,
  Undo2,
  Redo2,
  RemoveFormatting,
  Palette,
  Minus,
  X,
  Plus,
  Trash2,
  ShieldCheck,
  FileText,
  Copy,
  CheckCircle2,
} from "lucide-react";

interface DescriptionTabProps {
  shortDescription: string;
  setShortDescription: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  keyFeatures: string[];
  setKeyFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  warranty: string;
  setWarranty: (val: string) => void;
  warrantyPolicy: string;
  setWarrantyPolicy: (val: string) => void;
  setActiveTab: (val: any) => void;
}

const COLOR_PALETTE = [
  { name: "Default", color: "inherit" },
  { name: "Primary Green", color: "#003820" },
  { name: "Emerald", color: "#10b981" },
  { name: "Blue", color: "#2563eb" },
  { name: "Purple", color: "#7c3aed" },
  { name: "Amber", color: "#d97706" },
  { name: "Rose", color: "#e11d48" },
  { name: "Dark Slate", color: "#334155" },
];

export default function DescriptionTab({
  shortDescription,
  setShortDescription,
  description,
  setDescription,
  keyFeatures = [],
  setKeyFeatures,
  warranty,
  setWarranty,
  warrantyPolicy,
  setWarrantyPolicy,
  setActiveTab,
}: DescriptionTabProps) {
  // Rich Editor local state
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorTab, setEditorTab] = useState<"visual" | "code" | "preview">("visual");
  const [rawHtml, setRawHtml] = useState(description || "");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const isUpdatingFromProps = useRef(false);

  // Key Features local state
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [bulkFeatureText, setBulkFeatureText] = useState("");
  const [showBulkFeatureModal, setShowBulkFeatureModal] = useState(false);

  // Sync description from props to editor
  useEffect(() => {
    if (editorRef.current && editorTab === "visual") {
      if (editorRef.current.innerHTML !== (description || "")) {
        isUpdatingFromProps.current = true;
        editorRef.current.innerHTML = description || "";
        isUpdatingFromProps.current = false;
      }
    }
    setRawHtml(description || "");
  }, [description, editorTab]);

  const handleEditorInput = useCallback(() => {
    if (isUpdatingFromProps.current) return;
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      setDescription(html);
    }
  }, [setDescription]);

  const exec = (command: string, val: string | undefined = undefined) => {
    if (editorTab !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleEditorInput();
  };

  const handleFormatBlock = (tag: string) => {
    exec("formatBlock", tag);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const url = linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
      ? linkUrl
      : \`https://\${linkUrl}\`;
    
    if (linkText.trim()) {
      const linkHtml = \`<a href="\${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold">\${linkText}</a>\`;
      exec("insertHTML", linkHtml);
    } else {
      exec("createLink", url);
    }

    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    const imgHtml = \`<figure class="my-4 text-center"><img src="\${imageUrl}" alt="\${imageAlt || "Product image"}" class="max-w-full h-auto rounded-xl mx-auto shadow-sm border border-slate-200 dark:border-slate-800" />\${imageAlt ? \`<figcaption class="text-xs text-muted-foreground mt-1.5 italic">\${imageAlt}</figcaption>\` : ""}</figure>\`;
    exec("insertHTML", imgHtml);
    setImageUrl("");
    setImageAlt("");
    setShowImageModal(false);
  };

  const handleInsertTable = () => {
    const tableHtml = \`
      <table class="w-full my-4 border-collapse border border-slate-200 dark:border-slate-800 text-xs">
        <thead>
          <tr class="bg-slate-100 dark:bg-slate-800/80">
            <th class="border border-slate-200 dark:border-slate-800 p-2.5 text-left font-bold text-slate-800 dark:text-slate-200">Specification</th>
            <th class="border border-slate-200 dark:border-slate-800 p-2.5 text-left font-bold text-slate-800 dark:text-slate-200">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 font-medium">Model / Edition</td>
            <td class="border border-slate-200 dark:border-slate-800 p-2 text-slate-800 dark:text-slate-100">Standard Flagship Edition</td>
          </tr>
          <tr>
            <td class="border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 font-medium">Certification</td>
            <td class="border border-slate-200 dark:border-slate-800 p-2 text-slate-800 dark:text-slate-100">CE / RoHS Certified</td>
          </tr>
        </tbody>
      </table>
    \`;
    exec("insertHTML", tableHtml);
  };

  const handleInsertTemplate = (type: "features" | "callout" | "checklist" | "box_contents") => {
    let templateHtml = "";

    if (type === "features") {
      templateHtml = \`
        <div class="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Key Product Highlights</h3>
          <ul class="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li>✅ <strong>Premium Build:</strong> Engineered with aerospace-grade durability and sleek finish.</li>
            <li>✅ <strong>High Performance:</strong> Enhanced responsiveness and energy-efficient architecture.</li>
            <li>✅ <strong>Ergonomic Design:</strong> Crafted for effortless everyday usage and comfort.</li>
          </ul>
        </div>
      \`;
    } else if (type === "callout") {
      templateHtml = \`
        <div class="my-4 p-4 rounded-xl border-l-4 border-primary bg-primary/5 text-slate-800 dark:text-slate-200 text-xs">
          <p class="font-bold text-sm text-primary mb-1">💡 Professional Pro Tip</p>
          <p>For optimal performance and maximum longevity, follow manufacturer care instructions.</p>
        </div>
      \`;
    } else if (type === "checklist") {
      templateHtml = \`
        <div class="my-3 space-y-1.5 text-xs">
          <p class="font-bold text-slate-900 dark:text-white">Why You'll Love It:</p>
          <p>✔️ 100% Genuine & Brand New</p>
          <p>✔️ QC Tested & Verified</p>
          <p>✔️ Fast Nationwide Delivery</p>
        </div>
      \`;
    } else if (type === "box_contents") {
      templateHtml = \`
        <div class="my-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">📦 What's in the Box:</h4>
          <ul class="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>1x Main Product Unit</li>
            <li>1x Charging / Interface Cable</li>
            <li>1x Official User Manual & Warranty Card</li>
          </ul>
        </div>
      \`;
    }

    exec("insertHTML", templateHtml);
    setShowTemplateMenu(false);
  };

  const handleAddFeature = () => {
    const trimmed = newFeatureInput.trim();
    if (!trimmed) return;
    setKeyFeatures([...keyFeatures, trimmed]);
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, idx) => idx !== index));
  };

  const handleBulkAddFeatures = () => {
    if (!bulkFeatureText.trim()) return;
    const lines = bulkFeatureText
      .split("\\n")
      .map((l) => l.replace(/^[-*•✅✔️\\s]+/, "").trim())
      .filter((l) => l.length > 0);
    
    setKeyFeatures([...keyFeatures, ...lines]);
    setBulkFeatureText("");
    setShowBulkFeatureModal(false);
  };

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border space-y-6 animate-fade-in">
      
      {/* SECTION 1: KEY FEATURE HIGHLIGHTS (IMAGE 3 CHECKMARK LIST) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-500 font-black text-xs">
                ✅
              </span>
              Key Feature Highlights (Bullet Points with Checkmarks)
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Add prominent bullet points shown on the product page (e.g. Bluetooth 5.4, Battery 300mAh, 7 hours Use time, Material ABS).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowBulkFeatureModal(true)}
            className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <Copy size={12} /> Bulk Paste
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs select-none">✅</span>
            <input
              type="text"
              placeholder="e.g. Bluetooth 5.4; chip: Jerry AC7003D4"
              value={newFeatureInput}
              onChange={(e) => setNewFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground outline-none focus:border-primary transition-all"
            />
          </div>
          <button
            type="button"
            onClick={handleAddFeature}
            className="h-10 px-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus size={14} />
            <span>Add Highlight</span>
          </button>
        </div>

        {/* Active Features List Preview */}
        {keyFeatures.length > 0 && (
          <div className="space-y-2 p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
              Active Highlights ({keyFeatures.length}):
            </span>
            <div className="space-y-2">
              {keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-card border border-border hover:border-emerald-500/40 transition-all group"
                >
                  <div className="flex items-start gap-2 text-xs font-semibold text-foreground flex-1">
                    <span className="text-emerald-500 shrink-0 font-bold select-none text-sm leading-none">✅</span>
                    <span className="leading-snug">{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: PRODUCT DESCRIPTIONS */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            Short Description <span className="text-red-500">*</span> (Overview Summary)
          </label>
          <input
            type="text"
            required
            placeholder="A punchy, one-line summary of key product capabilities..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* FULL WYSIWYG RICH TEXT EDITOR FOR DETAILED DESCRIPTION */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={13} className="text-primary" />
              Detailed Description (Industrial Rich WYSIWYG Editor)
            </label>
            <span className="text-[10px] text-muted-foreground">HTML Formatted</span>
          </div>

          <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
            {/* Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between border-b border-border/80 bg-muted/30 px-3 py-2 gap-2">
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setEditorTab("visual")}
                  className={\`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer \${
                    editorTab === "visual"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }\`}
                >
                  <Sparkles size={12} className={editorTab === "visual" ? "text-primary" : ""} />
                  <span>Visual Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("code")}
                  className={\`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer \${
                    editorTab === "code"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }\`}
                >
                  <FileCode size={12} className={editorTab === "code" ? "text-primary" : ""} />
                  <span>HTML Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={\`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer \${
                    editorTab === "preview"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }\`}
                >
                  <Eye size={12} className={editorTab === "preview" ? "text-primary" : ""} />
                  <span>Live Preview</span>
                </button>
              </div>

              {/* Template Presets */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                  className="h-7 px-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold flex items-center gap-1 border border-primary/20 cursor-pointer transition-colors"
                >
                  <Sparkles size={11} />
                  <span>Insert Template</span>
                </button>

                {showTemplateMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 p-1.5 bg-card border border-border rounded-xl shadow-xl z-30 space-y-1 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("features")}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>⭐ Key Highlights Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("callout")}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>💡 Highlight Callout Box</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("checklist")}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>✔️ Checkmark Feature List</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate("box_contents")}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>📦 What's in the Box Card</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Toolbar for Visual Mode */}
            {editorTab === "visual" && (
              <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/20 border-b border-border/60">
                {/* History */}
                <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
                  <button
                    type="button"
                    onClick={() => exec("undo")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Undo"
                  >
                    <Undo2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("redo")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Redo"
                  >
                    <Redo2 size={13} />
                  </button>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
                  <button
                    type="button"
                    onClick={() => handleFormatBlock("<p>")}
                    className="px-2 py-1 rounded text-[11px] font-semibold hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Paragraph"
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatBlock("<h2>")}
                    className="px-2 py-1 rounded text-[11px] font-bold hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatBlock("<h3>")}
                    className="px-2 py-1 rounded text-[11px] font-bold hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Heading 3"
                  >
                    H3
                  </button>
                </div>

                {/* Formats */}
                <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
                  <button
                    type="button"
                    onClick={() => exec("bold")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Bold"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("italic")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Italic"
                  >
                    <Italic size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("underline")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Underline"
                  >
                    <Underline size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("strikeThrough")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Strikethrough"
                  >
                    <Strikethrough size={13} />
                  </button>
                </div>

                {/* Lists & Quotes */}
                <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
                  <button
                    type="button"
                    onClick={() => exec("insertUnorderedList")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Bullet List"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("insertOrderedList")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatBlock("<blockquote>")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Blockquote"
                  >
                    <Quote size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("insertHorizontalRule")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Divider"
                  >
                    <Minus size={13} />
                  </button>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
                  <button
                    type="button"
                    onClick={() => exec("justifyLeft")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Align Left"
                  >
                    <AlignLeft size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("justifyCenter")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Align Center"
                  >
                    <AlignCenter size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("justifyRight")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Align Right"
                  >
                    <AlignRight size={13} />
                  </button>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5 relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Text Color"
                  >
                    <Palette size={13} />
                  </button>

                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 p-2 bg-card border border-border rounded-xl shadow-xl z-30 grid grid-cols-4 gap-1.5 w-36 animate-fade-in">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            exec("foreColor", c.color);
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded-full border border-border cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
                          style={{ backgroundColor: c.color === "inherit" ? "#94a3b8" : c.color }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Inserts */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(true)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Insert Link"
                  >
                    <LinkIcon size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Embed Image"
                  >
                    <ImageIcon size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertTable}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Insert Table"
                  >
                    <TableIcon size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("removeFormat")}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Clear Formatting"
                  >
                    <RemoveFormatting size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Surface */}
            <div className="relative">
              {editorTab === "visual" && (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  onBlur={handleEditorInput}
                  style={{ minHeight: "280px" }}
                  className="p-4 text-xs font-normal leading-relaxed text-foreground outline-none focus:ring-0 overflow-y-auto custom-scrollbar prose dark:prose-invert max-w-none"
                />
              )}

              {editorTab === "code" && (
                <textarea
                  value={rawHtml}
                  onChange={(e) => {
                    setRawHtml(e.target.value);
                    setDescription(e.target.value);
                  }}
                  style={{ minHeight: "280px" }}
                  placeholder="<div>Write custom HTML markup here...</div>"
                  className="w-full p-4 font-mono text-xs text-foreground bg-zinc-950/90 dark:bg-black/90 text-emerald-400 outline-none resize-y border-0 focus:ring-0"
                />
              )}

              {editorTab === "preview" && (
                <div
                  style={{ minHeight: "280px" }}
                  className="p-5 text-xs text-foreground leading-relaxed overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/30"
                >
                  {rawHtml ? (
                    <div
                      className="prose dark:prose-invert max-w-none text-xs"
                      dangerouslySetInnerHTML={{ __html: rawHtml }}
                    />
                  ) : (
                    <div className="py-12 text-center text-muted-foreground text-xs">
                      No description content to preview yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: WARRANTY & SUPPORT SETTINGS */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            Warranty & Customer Support Policy
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure warranty badges, replacement duration, and customer service terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Warranty Title / Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 1 Year Official Brand Warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Warranty & Claim Details (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 7 Days Replacement Guarantee; Keep invoice and package intact for claim."
              value={warrantyPolicy}
              onChange={(e) => setWarrantyPolicy(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className="h-9 px-4 border border-border bg-card text-foreground hover:bg-muted text-xs font-bold rounded-lg cursor-pointer"
        >
          Back to Pricing
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("variants")}
          className="h-9 px-5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 cursor-pointer shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5"
        >
          <span>Continue to Specifications & Variants</span>
          <span>→</span>
        </button>
      </div>

      {/* Bulk Features Modal */}
      {showBulkFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card w-full max-w-md p-5 rounded-2xl border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Copy size={13} className="text-primary" />
                Bulk Paste Feature Highlights
              </h4>
              <button
                type="button"
                onClick={() => setShowBulkFeatureModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Paste bullet points line by line from your product sheet. Any leading bullets (•, -, *, ✅) will automatically be parsed.
            </p>

            <textarea
              rows={6}
              placeholder="Bluetooth 5.4; chip: Jerry AC7003D4&#10;Battery capacity: charging case 300mAh; headset 40mAh&#10;Use time: 7 hours (ANC on 6 hours)&#10;Material: ABS; size:61*51.5*28.5 mm; total weight: 44.8g&#10;With APP function, supports for hall switch"
              value={bulkFeatureText}
              onChange={(e) => setBulkFeatureText(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-card text-xs font-mono text-foreground outline-none focus:border-primary resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkFeatureModal(false)}
                className="h-8 px-3 text-xs font-bold rounded-lg border border-border hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkAddFeatures}
                className="h-8 px-4 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 cursor-pointer"
              >
                Import All Lines
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Inserter Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card w-full max-w-sm p-4 rounded-xl border border-border shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon size={12} className="text-primary" />
                Insert Web Link
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Link URL *</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-border bg-card text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Link Text (Optional)</label>
                <input
                  type="text"
                  placeholder="Click here to view"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-border bg-card text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="h-7 px-3 text-xs font-bold rounded-lg border border-border hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="h-7 px-4 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Inserter Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-card w-full max-w-sm p-4 rounded-xl border border-border shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={12} className="text-primary" />
                Embed Image into Description
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Image URL *</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-border bg-card text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Caption / Alt text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Product Dimensions Diagram"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-border bg-card text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="h-7 px-3 text-xs font-bold rounded-lg border border-border hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                className="h-7 px-4 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 cursor-pointer"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(descTabPath, descTabContent, 'utf-8');
console.log("1. Successfully created DescriptionTab.tsx");

// 2. Update create/page.tsx to import DescriptionTab and have 6 tabs
const createPagePath = 'G:/ECommerce_POS_Admin_Dashboard/e-commerce-pos-admin-dashboard/src/app/(commerce)/products/create/page.tsx';
let createPageContent = fs.readFileSync(createPagePath, 'utf-8');

// Ensure DescriptionTab is imported
if (!createPageContent.includes('import DescriptionTab')) {
  createPageContent = createPageContent.replace(
    'import GeneralTab from "@/components/ui/commerce/products/create/GeneralTab";',
    `import GeneralTab from "@/components/ui/commerce/products/create/GeneralTab";
import DescriptionTab from "@/components/ui/commerce/products/create/DescriptionTab";`
  );
}

// Ensure activeTab supports "description"
createPageContent = createPageContent.replace(
  'const [activeTab, setActiveTab] = useState<"general" | "media" | "pricing" | "seo" | "variants">("general");',
  'const [activeTab, setActiveTab] = useState<"general" | "media" | "pricing" | "description" | "variants" | "seo">("general");'
);

// Ensure stepper tabs list includes 4. Description & Content
const stepperTarget = `      {/* Modern Stepper Tabs */}
      <div className="flex border-b border-border gap-6 overflow-x-auto pb-0.5 custom-scrollbar">
        {[
          { key: "general", label: "1. Info & Relations", icon: <Info size={14} /> },
          { key: "media", label: "2. Product Media", icon: <ImageIcon size={14} /> },
          { key: "pricing", label: "3. Pricing & Inventory", icon: <TbCurrencyTaka size={14} /> },
          { key: "seo", label: "4. SEO Configurations", icon: <Globe size={14} /> },
          { key: "variants", label: "5. Specifications & Variants", icon: <Sliders size={14} /> },
        ].map((tab) => (`;

const stepperReplacement = `      {/* Modern Stepper Tabs */}
      <div className="flex border-b border-border gap-6 overflow-x-auto pb-0.5 custom-scrollbar">
        {[
          { key: "general", label: "1. Info & Relations", icon: <Info size={14} /> },
          { key: "media", label: "2. Product Media", icon: <ImageIcon size={14} /> },
          { key: "pricing", label: "3. Pricing & Inventory", icon: <TbCurrencyTaka size={14} /> },
          { key: "description", label: "4. Description & Content", icon: <FileText size={14} /> },
          { key: "variants", label: "5. Specifications & Variants", icon: <Sliders size={14} /> },
          { key: "seo", label: "6. SEO Configurations", icon: <Globe size={14} /> },
        ].map((tab) => (`;

if (createPageContent.includes(stepperTarget)) {
  createPageContent = createPageContent.replace(stepperTarget, stepperReplacement);
}

// Ensure activeTab === "description" renders DescriptionTab
const renderDescTarget = `{activeTab === "pricing" && (`;
const renderDescReplacement = `{activeTab === "description" && (
            <DescriptionTab
              shortDescription={shortDescription}
              setShortDescription={setShortDescription}
              description={description}
              setDescription={setDescription}
              keyFeatures={keyFeatures}
              setKeyFeatures={setKeyFeatures}
              warranty={warranty}
              setWarranty={setWarranty}
              warrantyPolicy={warrantyPolicy}
              setWarrantyPolicy={setWarrantyPolicy}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "pricing" && (`;

if (createPageContent.includes(renderDescTarget) && !createPageContent.includes('activeTab === "description"')) {
  createPageContent = createPageContent.replace(renderDescTarget, renderDescReplacement);
}

fs.writeFileSync(createPagePath, createPageContent, 'utf-8');
console.log("2. Successfully updated Admin create/page.tsx with 6 Stepper Tabs including 4. Description & Content");

// 3. Add Edit Button and Specs to [slug]/page.tsx
const slugPagePath = 'G:/ECommerce_POS_Admin_Dashboard/e-commerce-pos-admin-dashboard/src/app/(commerce)/products/[slug]/page.tsx';
let slugPageContent = fs.readFileSync(slugPagePath, 'utf-8');

// Ensure Edit Product button exists in header
if (!slugPageContent.includes('Modify Product Details') && !slugPageContent.includes('/products/create?edit=')) {
  const headerTarget = `<div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
          <span className="opacity-50">/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </div>`;

  const headerReplacement = `<div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
          <span className="opacity-50">/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={\`/products/create?edit=\${product._id || product.id}\`}
            className="h-10 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span>Edit Product</span>
          </Link>`;

  if (slugPageContent.includes(headerTarget)) {
    slugPageContent = slugPageContent.replace(headerTarget, headerReplacement);
  }
}

fs.writeFileSync(slugPagePath, slugPageContent, 'utf-8');
console.log("3. Successfully updated [slug]/page.tsx");

console.log("Upgrade finished successfully!");

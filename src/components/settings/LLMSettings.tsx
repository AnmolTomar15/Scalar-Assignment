"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Key,
  Cpu,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Zap,
  Server,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { fetchLLMConfig, saveLLMConfig, testLLMConnection, LLMConfig } from "@/lib/api";

type Provider = "auto" | "openai" | "gemini" | "local";

interface TestState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  provider: string;
}

const PROVIDER_LABELS: Record<Provider, { label: string; color: string; glow: string; bg: string; border: string; desc: string }> = {
  auto: {
    label: "Auto",
    color: "text-violet-300",
    glow: "shadow-violet-500/20",
    bg: "bg-violet-500/10",
    border: "border-violet-500/40",
    desc: "Automatically picks the best available provider",
  },
  openai: {
    label: "OpenAI",
    color: "text-emerald-300",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    desc: "GPT-4o, GPT-4o-mini, and compatible endpoints",
  },
  gemini: {
    label: "Gemini",
    color: "text-blue-300",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
    desc: "Google Gemini 1.5 Flash, Pro, and 2.0 models",
  },
  local: {
    label: "Local",
    color: "text-amber-300",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-500/10",
    border: "border-amber-500/40",
    desc: "Built-in rule-based NLP pipeline — no API key needed",
  },
};

interface FieldProps {
  label: string;
  id: string;
  value: string;
  placeholder?: string;
  masked?: boolean;
  onChange: (v: string) => void;
}

function SecretField({ label, id, value, placeholder, onChange }: FieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Enter API key…"}
          autoComplete="off"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label={show ? "Hide key" : "Show key"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function TextField({ label, id, value, placeholder, onChange }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
      />
    </div>
  );
}

export default function LLMSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [provider, setProvider] = useState<Provider>("auto");
  const [openaiKey, setOpenaiKey] = useState("");
  const [openaiModel, setOpenaiModel] = useState("gpt-4o-mini");
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState("https://api.openai.com/v1");
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-1.5-flash");

  const [hasOpenaiKey, setHasOpenaiKey] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [maskedOpenai, setMaskedOpenai] = useState("");
  const [maskedGemini, setMaskedGemini] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [testState, setTestState] = useState<TestState>({ status: "idle", message: "", provider: "" });

  const loadConfig = async () => {
    try {
      const cfg: LLMConfig = await fetchLLMConfig();
      setProvider((cfg.provider as Provider) || "auto");
      setOpenaiModel(cfg.openai_model || "gpt-4o-mini");
      setOpenaiBaseUrl(cfg.openai_base_url || "https://api.openai.com/v1");
      setGeminiModel(cfg.gemini_model || "gemini-1.5-flash");
      setHasOpenaiKey(cfg.has_openai_key);
      setHasGeminiKey(cfg.has_gemini_key);
      setMaskedOpenai(cfg.openai_api_key_masked || "");
      setMaskedGemini(cfg.gemini_api_key_masked || "");
      setUpdatedAt(cfg.updated_at);
    } catch {
      // Silently fail — backend might not be running
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload: Record<string, string> = { provider };
      if (openaiKey) payload.openai_api_key = openaiKey;
      payload.openai_model = openaiModel;
      payload.openai_base_url = openaiBaseUrl;
      if (geminiKey) payload.gemini_api_key = geminiKey;
      payload.gemini_model = geminiModel;

      const updated = await saveLLMConfig(payload);
      setHasOpenaiKey(updated.has_openai_key);
      setHasGeminiKey(updated.has_gemini_key);
      setMaskedOpenai(updated.openai_api_key_masked || "");
      setMaskedGemini(updated.gemini_api_key_masked || "");
      setUpdatedAt(updated.updated_at);
      setOpenaiKey("");
      setGeminiKey("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    // Auto-save first if there are unsaved keys
    if (openaiKey || geminiKey) await handleSave();
    setTestState({ status: "loading", message: "Testing connection…", provider: "" });
    try {
      const result = await testLLMConnection();
      setTestState({
        status: result.success ? "success" : "error",
        message: result.message,
        provider: result.provider,
      });
    } catch (e: any) {
      setTestState({ status: "error", message: e.message || "Connection test failed", provider: "" });
    }
  };

  const pInfo = PROVIDER_LABELS[provider];
  const providers: Provider[] = ["auto", "openai", "gemini", "local"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Bot className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-white">AI Provider Configuration</h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Connect a live LLM to generate real AI summaries, key topics, and action items from your meeting transcripts.
            </p>
            {updatedAt && (
              <p className="text-[11px] text-slate-600 mt-2">
                Last updated: {new Date(updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Status Pills */}
        <div className="relative flex flex-wrap gap-2 mt-5">
          {hasOpenaiKey && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> OpenAI key configured
            </span>
          )}
          {hasGeminiKey && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <CheckCircle2 className="h-3 w-3" /> Gemini key configured
            </span>
          )}
          {!hasOpenaiKey && !hasGeminiKey && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="h-3 w-3" /> Using local NLP pipeline
            </span>
          )}
        </div>
      </div>

      {/* Provider Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="h-4 w-4 text-slate-400" />
          <h4 className="text-sm font-bold text-white">Select Provider</h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {providers.map((p) => {
            const info = PROVIDER_LABELS[p];
            const isActive = provider === p;
            return (
              <button
                key={p}
                id={`llm-provider-${p}`}
                onClick={() => { setProvider(p); setTestState({ status: "idle", message: "", provider: "" }); }}
                className={`relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left ${
                  isActive
                    ? `${info.bg} ${info.border} shadow-lg ${info.glow}`
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                {isActive && (
                  <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${
                    p === "auto" ? "bg-violet-400" :
                    p === "openai" ? "bg-emerald-400" :
                    p === "gemini" ? "bg-blue-400" : "bg-amber-400"
                  } animate-pulse`} />
                )}
                <span className={`text-sm font-bold ${isActive ? info.color : "text-slate-400"}`}>
                  {info.label}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {info.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* OpenAI Config — shown when provider is auto or openai */}
      {(provider === "auto" || provider === "openai") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Key className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">OpenAI Configuration</h4>
              {hasOpenaiKey && maskedOpenai && (
                <p className="text-[11px] text-slate-500">Current key: <span className="font-mono text-emerald-500">{maskedOpenai}</span></p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecretField
              label="API Key"
              id="openai-api-key"
              value={openaiKey}
              placeholder={hasOpenaiKey ? "Enter new key to replace…" : "sk-…"}
              onChange={setOpenaiKey}
            />
            <TextField
              label="Model"
              id="openai-model"
              value={openaiModel}
              placeholder="gpt-4o-mini"
              onChange={setOpenaiModel}
            />
          </div>
          <TextField
            label="Base URL (optional — for custom/proxy endpoints)"
            id="openai-base-url"
            value={openaiBaseUrl}
            placeholder="https://api.openai.com/v1"
            onChange={setOpenaiBaseUrl}
          />
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Supported models: <span className="text-slate-500">gpt-4o-mini</span>, <span className="text-slate-500">gpt-4o</span>, <span className="text-slate-500">gpt-3.5-turbo</span>, or any OpenAI-compatible endpoint.
          </p>
        </div>
      )}

      {/* Gemini Config — shown when provider is auto or gemini */}
      {(provider === "auto" || provider === "gemini") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <div className="h-7 w-7 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <Key className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Google Gemini Configuration</h4>
              {hasGeminiKey && maskedGemini && (
                <p className="text-[11px] text-slate-500">Current key: <span className="font-mono text-blue-500">{maskedGemini}</span></p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecretField
              label="API Key"
              id="gemini-api-key"
              value={geminiKey}
              placeholder={hasGeminiKey ? "Enter new key to replace…" : "AIza…"}
              onChange={setGeminiKey}
            />
            <TextField
              label="Model"
              id="gemini-model"
              value={geminiModel}
              placeholder="gemini-1.5-flash"
              onChange={setGeminiModel}
            />
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Supported models: <span className="text-slate-500">gemini-1.5-flash</span>, <span className="text-slate-500">gemini-1.5-pro</span>, <span className="text-slate-500">gemini-2.0-flash</span>.
          </p>
        </div>
      )}

      {/* Local Pipeline Info */}
      {provider === "local" && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
              <Server className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Local NLP Pipeline</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                MinuteAI's built-in rule-based pipeline will generate summaries, key topics, and action items without any external API calls. No API key required — works offline.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-amber-400 font-semibold">100% private — no data leaves your machine</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Connection Result */}
      {testState.status !== "idle" && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
            testState.status === "loading"
              ? "bg-slate-900 border-slate-700"
              : testState.status === "success"
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-rose-500/10 border-rose-500/30"
          }`}
        >
          {testState.status === "loading" && <Loader2 className="h-5 w-5 text-slate-400 animate-spin mt-0.5 shrink-0" />}
          {testState.status === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />}
          {testState.status === "error" && <XCircle className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />}
          <div>
            <p className={`text-sm font-semibold ${
              testState.status === "loading" ? "text-slate-300" :
              testState.status === "success" ? "text-emerald-300" : "text-rose-300"
            }`}>
              {testState.status === "loading" ? "Testing connection…" :
               testState.status === "success" ? "Connection Successful" : "Connection Failed"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{testState.message}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          id="llm-test-connection"
          onClick={handleTest}
          disabled={testState.status === "loading" || saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700 text-sm font-semibold text-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testState.status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 text-indigo-400" />
          )}
          Test Connection
        </button>

        <button
          id="llm-save-config"
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            saved
              ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
          }`}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}

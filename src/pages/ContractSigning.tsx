import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Check, Download, Send, Shield, Clock, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Step = "generate" | "review" | "signed";

const CONTRACT_TEMPLATE = (brand: string, creator: string, product: string, fee: string, deliverables: string) => `
CREATOR COLLABORATION AGREEMENT

Parties
────────────────────────────────
Brand:   ${brand || "[Brand Name]"}
Creator: ${creator || "[Creator Name]"}
Date:    ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

Campaign Overview
────────────────────────────────
Product / Campaign: ${product || "[Product or Campaign Name]"}
Compensation:       ${fee || "[Fee]"}
Deliverables:       ${deliverables || "[Content deliverables]"}
Timeline:           Content due within 10 business days of product receipt

Content License
────────────────────────────────
Creator grants Brand a worldwide, non-exclusive, royalty-free licence to use, reproduce, and display the delivered content for a period of 12 months across all digital channels including paid advertising.

Creator Obligations
────────────────────────────────
• Deliver content as described above, on schedule
• Disclose the collaboration in accordance with FTC/ASA guidelines (#ad or #sponsored)
• Ensure content is original and does not infringe third-party rights
• Maintain confidentiality about campaign details until brand approval

Brand Obligations
────────────────────────────────
• Provide product or campaign materials within 3 business days of signing
• Review and approve content within 5 business days of delivery
• Release payment within 48 hours of content approval
• Provide clear creative brief and feedback

Payment
────────────────────────────────
Full payment of ${fee || "[Fee]"} to be released via Lumeya within 48 hours of content approval. Lumeya holds payment in escrow until both parties confirm delivery.

Revisions
────────────────────────────────
Brand may request up to 2 rounds of revisions within the scope of the original brief. Additional revisions may be subject to additional fees.

Dispute Resolution
────────────────────────────────
Any disputes shall first be resolved through Lumeya's mediation process before any legal proceedings.

This agreement is legally binding once signed by both parties via the Lumeya platform.
`.trim();

const ContractSigning = () => {
  const [step, setStep] = useState<Step>("generate");
  const [brand, setBrand] = useState("");
  const [creator, setCreator] = useState("");
  const [product, setProduct] = useState("");
  const [fee, setFee] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [contract, setContract] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  const generate = () => {
    if (!brand || !creator) { toast.error("Brand and creator name required"); return; }
    setContract(CONTRACT_TEMPLATE(brand, creator, product, fee, deliverables));
    setStep("review");
  };

  const sign = async () => {
    if (!agreed) { toast.error("Please agree to the terms first"); return; }
    setSigning(true);
    await new Promise(r => setTimeout(r, 1500));
    setSigning(false);
    setStep("signed");
    toast.success("Contract signed and sent to both parties!");
  };

  return (
    <div className="container py-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-5">
          <FileText size={12} /> Contract Signing
        </div>
        <h1 className="text-4xl font-display font-normal">
          Legally protected.<br />
          <em className="text-primary/70">Always.</em>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          Auto-generate a creator contract, review it, and sign — all in under 2 minutes.
        </p>
      </motion.div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-10">
        {(["generate", "review", "signed"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${
              step === s ? "bg-primary text-white" :
              (["generate", "review", "signed"].indexOf(step) > i) ? "bg-emerald-500 text-white" :
              "bg-accent text-muted-foreground"
            }`}>
              {(["generate", "review", "signed"].indexOf(step) > i) ? <Check size={10} /> : i + 1}
            </div>
            <span className="text-xs text-muted-foreground capitalize hidden sm:block">{s === "generate" ? "Details" : s}</span>
            {i < 2 && <div className="w-8 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "generate" && (
          <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Brand Name *</label>
                <Input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. GlowCo" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Creator Name *</label>
                <Input value={creator} onChange={e => setCreator(e.target.value)} placeholder="e.g. Ronja Aaslund" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Product / Campaign</label>
              <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Summer Serum Launch" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Creator Fee</label>
                <Input value={fee} onChange={e => setFee(e.target.value)} placeholder="e.g. €350" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Deliverables</label>
                <Input value={deliverables} onChange={e => setDeliverables(e.target.value)} placeholder="e.g. 2 TikTok videos" />
              </div>
            </div>
            <Button className="w-full rounded-full gap-2 mt-2" onClick={generate}>
              <Sparkles size={14} /> Generate Contract
            </Button>

            <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 p-4 mt-4">
              <Shield size={14} className="text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">Contracts generated by Lumeya follow standard creator economy agreements and include FTC disclosure requirements, content licensing terms, and payment escrow conditions.</p>
            </div>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-accent/30">
                <span className="text-xs font-medium flex items-center gap-2"><FileText size={13} /> Collaboration Agreement</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> Generated just now</span>
              </div>
              <pre className="px-5 py-5 text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap font-mono overflow-x-auto max-h-[400px] overflow-y-auto">
                {contract}
              </pre>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              <label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I have read and agree to this contract. I understand this is a legally binding agreement and my electronic signature below constitutes full acceptance of all terms.
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full text-xs" onClick={() => { navigator.clipboard.writeText(contract); toast.success("Copied!"); }}>
                <Download size={13} className="mr-1.5" /> Copy Contract
              </Button>
              <Button className="flex-1 rounded-full text-xs gap-1.5" onClick={sign} disabled={!agreed || signing}>
                {signing ? "Signing..." : <><Send size={13} /> Sign & Send</>}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Shield size={11} className="text-emerald-500" />
              Secured by Lumeya. Both parties receive a copy via email.
            </div>
          </motion.div>
        )}

        {step === "signed" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-display mb-3">Contract Signed ✦</h2>
            <p className="text-sm text-muted-foreground mb-2">A copy has been sent to both <strong>{brand}</strong> and <strong>{creator}</strong>.</p>
            <p className="text-xs text-muted-foreground mb-10">Payment of <strong>{fee}</strong> is now held in escrow and will be released upon content approval.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="rounded-full" onClick={() => { setStep("generate"); setAgreed(false); setBrand(""); setCreator(""); setProduct(""); setFee(""); setDeliverables(""); }}>
                New Contract
              </Button>
              <Button className="rounded-full">View Dashboard</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractSigning;
